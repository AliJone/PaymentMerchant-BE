// src/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserRole = require('../models/userRole.model');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { getAccessToken, setTokens } = require('../utils/zohoAuth');

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // if role is not one of ['user', 'seller', 'admin', 'super_admin'] then throw invalid role error
    if (!['user', 'seller', 'admin', 'super_admin'].includes(role)) {
      throw new ValidationError('Invalid role');
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone
    });
    await user.save();


    // Create default user role
    await UserRole.create({
      userId: user._id,
      roleType: role
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
        // Find user and get role in a single query
      const userWithRole = await User.aggregate([
        { $match: { email } },
        {
          $lookup: {
            from: 'userroles',
            localField: '_id',
            foreignField: 'userId',
            as: 'role'
          }
        },
        { $unwind: '$role' }
      ]).exec();

      if (!userWithRole.length) {
        throw new ValidationError('Invalid email or password');
      } 

      const user = userWithRole[0];

      console.log('User:', user);

      // Use static method for password comparison
      const isValidPassword = await User.comparePasswordHash(password, user.password);
      if (!isValidPassword) {
        throw new ValidationError('Invalid email or password');
      }
  
      // Get Zoho token
      const zohoTokenData = await getAccessToken();

      console.log('Zoho token data:', zohoTokenData);
      
      // Calculate token expiry
      const zohoTokenExpiry = new Date(Date.now() + (zohoTokenData.expires_in * 1000));
  
      const token = jwt.sign(
        { 
          userId: user._id,
          role: user.role.roleType,
          zohoToken: zohoTokenData.access_token,
          zohoTokenExpiry: zohoTokenExpiry,
          zohoRefreshToken: zohoTokenData.refresh_token
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role.roleType
          },
          token,
          zohoTokenExpiry
        }
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  register,
  login
};
