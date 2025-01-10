// src/controllers/organization.controller.js
const Organization = require('../models/organization.model');
const { NotFoundError } = require('../utils/errors');

const createOrganization = async (req, res, next) => {
  try {
    const organization = new Organization(req.body);
    await organization.save();
    res.status(201).json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

const getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find({ isActive: true });
    res.json({
      status: 'success',
      data: organizations
    });
  } catch (error) {
    next(error);
  }
};

const getOrganizationById = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }
    res.json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

const updateOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }
    res.json({
      status: 'success',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization
};