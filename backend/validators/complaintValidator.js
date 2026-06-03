const { validationResult, check } = require('express-validator');

/**
 * Validation Result Handler
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for creating/updating complaints
 */
const validateComplaint = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Complaint title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters long'),

  check('category')
    .custom((value, { req }) => {
      const categoryVal = value || req.body.department;
      if (!categoryVal) {
        throw new Error('Category is required');
      }
      const validDepts = [
        'Water Supply',
        'Electricity',
        'Roads',
        'Sanitation',
        'Healthcare',
        'Education',
        'Public Safety',
        'Other',
      ];
      if (!validDepts.includes(categoryVal)) {
        throw new Error('Please select a valid category');
      }
      // Ensure both category and department are populated in request body
      req.body.category = categoryVal;
      req.body.department = categoryVal;
      return true;
    }),

  check('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 3 })
    .withMessage('Location must be at least 3 characters'),

  check('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent'])
    .withMessage('Priority must be Low, Medium, High, or Urgent'),

  handleValidationErrors,
];

/**
 * Validation rules for status update
 */
const validateStatusUpdate = [
  check('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn([
      'Submitted',
      'Under Review',
      'Assigned',
      'In Progress',
      'Resolved',
      'Closed',
      'Rejected',
      'Pending', // legacy support
    ])
    .withMessage('Invalid status value. Must be one of: Submitted, Under Review, Assigned, In Progress, Resolved, Closed, Rejected'),

  check('remarks').custom((value, { req }) => {
    if (req.body.status === 'Rejected' && (!value || value.trim().length < 10)) {
      throw new Error('Remarks are required (min 10 chars) when rejecting a complaint');
    }
    return true;
  }),

  handleValidationErrors,
];

module.exports = { validateComplaint, validateStatusUpdate };
