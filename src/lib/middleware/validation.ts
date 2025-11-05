import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/responseHelper';

// Validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[\d\s\-\(\)]+$/;
const VALID_LOCATION_TYPES = ['office', 'branch', 'service_area', 'project_location'];

// Validation constraints
const CONSTRAINTS = {
  fullName: { min: 1, max: 100 },
  projectDetails: { min: 1, max: 2000 },
  description: { max: 1000 },
  password: { min: 6 },
  name: { min: 1, max: 255 }
};

const validateField = (field: string, value: any, constraints: { min?: number; max?: number }): string | null => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0)) {
    return `${field} is required`;
  }

  const length = typeof value === 'string' ? value.trim().length : value.length;

  if (constraints.min && length < constraints.min) {
    return `${field} must be at least ${constraints.min} characters`;
  }

  if (constraints.max && length > constraints.max) {
    return `${field} cannot exceed ${constraints.max} characters`;
  }

  return null;
};

export const validateContact = (req: Request, res: Response, next: NextFunction): void => {
  const { fullName, phoneNumber, emailAddress, projectDetails } = req.body;
  const errors: Record<string, string> = {};

  const nameError = validateField('Full name', fullName, CONSTRAINTS.fullName);
  if (nameError) errors.fullName = nameError;

  if (!phoneNumber || phoneNumber.trim().length === 0) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!PHONE_REGEX.test(phoneNumber.trim())) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }

  if (!emailAddress || emailAddress.trim().length === 0) {
    errors.emailAddress = 'Email address is required';
  } else if (!EMAIL_REGEX.test(emailAddress.trim())) {
    errors.emailAddress = 'Please enter a valid email address';
  }

  const detailsError = validateField('Project details', projectDetails, CONSTRAINTS.projectDetails);
  if (detailsError) errors.projectDetails = detailsError;

  if (Object.keys(errors).length > 0) {
    sendErrorResponse(res, 'Validation failed', 422, errors);
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  const errors: Record<string, string> = {};

  if (!email || email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  } else if (password.length < CONSTRAINTS.password.min) {
    errors.password = `Password must be at least ${CONSTRAINTS.password.min} characters`;
  }

  if (Object.keys(errors).length > 0) {
    sendErrorResponse(res, 'Validation failed', 422, errors);
    return;
  }

  next();
};

export const validateLocation = (req: Request, res: Response, next: NextFunction): void => {
  const { name, address, latitude, longitude, type, description } = req.body;
  const errors: Record<string, string> = {};

  const nameError = validateField('Name', name, CONSTRAINTS.name);
  if (nameError) errors.name = nameError;

  if (!address || address.trim().length === 0) {
    errors.address = 'Address is required';
  }

  if (latitude === undefined || latitude === null) {
    errors.latitude = 'Latitude is required';
  } else {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }
  }

  if (longitude === undefined || longitude === null) {
    errors.longitude = 'Longitude is required';
  } else {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }
  }

  if (type && !VALID_LOCATION_TYPES.includes(type)) {
    errors.type = `Type must be one of: ${VALID_LOCATION_TYPES.join(', ')}`;
  }

  if (description && description.length > CONSTRAINTS.description.max) {
    errors.description = `Description cannot exceed ${CONSTRAINTS.description.max} characters`;
  }

  if (Object.keys(errors).length > 0) {
    sendErrorResponse(res, 'Validation failed', 422, errors);
    return;
  }

  next();
};