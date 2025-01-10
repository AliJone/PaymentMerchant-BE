// src/controllers/userRole.controller.js
const UserRole = require('../models/userRole.model');
const { NotFoundError } = require('../utils/errors');

const assignRole = async (req, res, next) => {
  try {
    const userRole = new UserRole({
      userId: req.params.userId,
      roleType: req.body.roleType
    });
    await userRole.save();
    res.status(201).json({
      status: 'success',
      data: userRole
    });
  } catch (error) {
    next(error);
  }
};

const getUserRoles = async (req, res, next) => {
  try {
    const roles = await UserRole.find({ userId: req.params.userId });
    res.json({
      status: 'success',
      data: roles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignRole,
  getUserRoles
};