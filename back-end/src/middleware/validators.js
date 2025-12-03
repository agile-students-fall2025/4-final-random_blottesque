import { body, param, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User validation rules
export const validateSignup = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Group validation rules
export const validateCreateGroup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Group name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('roommates')
    .optional()
    .isArray()
    .withMessage('Roommates must be an array'),
  body('roommates.*')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Roommate entries cannot be empty'),
  handleValidationErrors
];

export const validateUpdateGroup = [
  param('id')
    .notEmpty()
    .withMessage('Group ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Group name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors
];

// Chore validation rules
export const validateCreateChore = [
  param('id')
    .notEmpty()
    .withMessage('Group ID is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Chore title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Chore title must be between 1 and 200 characters'),
  body('due')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('assignee')
    .optional()
    .trim(),
  body('repeat')
    .optional()
    .isIn(['None', 'Daily', 'Weekly', 'Monthly'])
    .withMessage('Repeat must be None, Daily, Weekly, or Monthly'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  handleValidationErrors
];

export const validateUpdateChore = [
  param('id')
    .notEmpty()
    .withMessage('Group ID is required'),
  param('cid')
    .notEmpty()
    .withMessage('Chore ID is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Chore title must be between 1 and 200 characters'),
  body('done')
    .optional()
    .isBoolean()
    .withMessage('Done must be a boolean value'),
  handleValidationErrors
];

// Expense validation rules
export const validateCreateExpense = [
  param('id')
    .notEmpty()
    .withMessage('Group ID is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Expense description is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('paidBy')
    .optional()
    .isObject()
    .withMessage('PaidBy must be an object'),
  handleValidationErrors
];

// Inventory validation rules
export const validateCreateInventoryItem = [
  param('id')
    .notEmpty()
    .withMessage('Group ID is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name must be between 1 and 100 characters'),
  body('status')
    .optional()
    .isIn(['Low', 'Good', 'Full'])
    .withMessage('Status must be Low, Good, or Full'),
  handleValidationErrors
];

// User profile validation
export const validateUpdateUser = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]*$/)
    .withMessage('Please provide a valid phone number'),
  body('photoUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Photo URL must be a valid URL'),
  handleValidationErrors
];
