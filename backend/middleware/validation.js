const { body, validationResult } = require('express-validator');

// Validation rules
const nameValidation = body('name')
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ min: 3, max: 50 })
  .withMessage('Name must be between 3-50 characters')
  .matches(/^[A-Za-z ]{3,50}$/)
  .withMessage('Name can only contain alphabets and spaces');

const emailValidation = body('email')
  .notEmpty()
  .withMessage('Email is required')
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage('Please enter a valid email address');

const passwordValidation = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 6, max: 16 })
  .withMessage('Password must be between 6-16 characters');
  // Removed strict password complexity for easier testing

const mobileValidation = body('mobile')
  .notEmpty()
  .withMessage('Mobile number is required')
  .matches(/^[6-9]\d{9}$/)
  .withMessage('Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9');

const roleValidation = body('role')
  .isIn(['instructor', 'student'])
  .withMessage('Invalid role');

const loginEmailValidation = body('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please enter a valid email address');

const loginPasswordValidation = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

const loginRoleValidation = body('role')
  .isIn(['admin', 'instructor', 'student'])
  .withMessage('Invalid role');

// Validation middleware arrays
const registerValidation = [
  nameValidation,
  emailValidation,
  passwordValidation,
  mobileValidation,
  roleValidation
];

const loginValidation = [
  loginEmailValidation,
  loginPasswordValidation,
  loginRoleValidation
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  handleValidationErrors
};