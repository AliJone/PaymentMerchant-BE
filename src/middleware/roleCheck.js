// src/middleware/roleCheck.js
const { ForbiddenError } = require('../utils/errors');
const SellerUserAssignment = require('../models/sellerUserAssignment.model');
const AdminSellerAssignment = require('../models/adminSellerAssignment.model');

/**
 * Middleware factory for role-based access control
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireTargetUser - Whether to require target user check
 * @param {Array} options.allowedRoles - Array of roles allowed to access the route
 */
const roleCheck = (options = { requireTargetUser: true, allowedRoles: [] }) => {
  return async (req, res, next) => {
    try {
      const { userId, role } = req.user; // From JWT token
      const targetUserId = req.params.userId || req.body.userId || req.query.userId;
      const targetSellerId = req.params.sellerId || req.body.sellerId || req.query.sellerId;

      const organizationId = 
        req.params.organizationId || 
        req.body.organizationId || 
        req.query.organizationId;

      // Super admin has access to everything
      if (role === 'super_admin') {
        return next();
      }

      // Check if role is allowed for this route
      if (options.allowedRoles.length && !options.allowedRoles.includes(role)) {
        throw new ForbiddenError('Insufficient permissions for this action');
      }

      if (options.requireTargetUser) {
        switch (role) {
          case 'admin':
            // If targeting a user, check if user belongs to an assigned seller
            if (targetUserId) {
              const assignedSellers = await AdminSellerAssignment.find({
                adminId: userId,
                isActive: true
              }).distinct('sellerId');

              const userBelongsToAssignedSeller = await SellerUserAssignment.exists({
                sellerId: { $in: assignedSellers },
                assignedUserId: targetUserId,
                isActive: true
              });

              if (!userBelongsToAssignedSeller) {
                throw new ForbiddenError('Not authorized to access this user\'s data');
              }
              // Validate organization ID presence
              if (!organizationId) {
                throw new ForbiddenError('Organization ID is required');
              }
            }
            // If targeting a seller, check if admin is assigned to that seller
            else if (targetSellerId) {
              const isAssignedSeller = await AdminSellerAssignment.exists({
                adminId: userId,
                sellerId: targetSellerId,
                isActive: true
              });

              if (!isAssignedSeller) {
                throw new ForbiddenError('Not authorized to access this seller\'s data');
              }
            }
            break;

          case 'seller':
            if (!targetUserId) {
              throw new ForbiddenError('Target user ID is required');
            }

            const isAssignedUser = await SellerUserAssignment.exists({
              sellerId: userId,
              assignedUserId: targetUserId,
              isActive: true
            });

            if (!isAssignedUser) {
              throw new ForbiddenError('Not authorized to access this user\'s data');
            }
            // Validate organization ID presence
            if (!organizationId) {
              throw new ForbiddenError('Organization ID is required');
            }
            break;

          case 'user':
            // Users can only access their own data
            if (targetUserId !== userId) {
              throw new ForbiddenError('Not authorized to access this data');
            }

            // Validate organization ID presence
            if (!organizationId) {
              throw new ForbiddenError('Organization ID is required');
            }
            break;
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { roleCheck };
