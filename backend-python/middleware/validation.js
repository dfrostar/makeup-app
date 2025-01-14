const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Registration validation rules
exports.validateRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    handleValidation
];

// Login validation rules
exports.validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidation
];

// Profile update validation rules
exports.validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    body('skinType')
        .optional()
        .isIn(['dry', 'oily', 'combination', 'normal', 'sensitive'])
        .withMessage('Invalid skin type'),
    body('skinConcerns')
        .optional()
        .isArray()
        .withMessage('Skin concerns must be an array'),
    body('preferredBrands')
        .optional()
        .isArray()
        .withMessage('Preferred brands must be an array'),
    handleValidation
];

// Product review validation rules
exports.validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
    body('content')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Review content must be between 10 and 1000 characters'),
    body('pros')
        .optional()
        .isArray()
        .withMessage('Pros must be an array'),
    body('cons')
        .optional()
        .isArray()
        .withMessage('Cons must be an array'),
    handleValidation
];

// Comment validation rules
exports.validateComment = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Comment must be between 1 and 500 characters'),
    handleValidation
];

// Look creation validation rules
exports.validateLook = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Look name must be between 3 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
    body('category')
        .isIn(['natural', 'glam', 'editorial', 'bridal', 'seasonal', 'night-out', 'work-appropriate'])
        .withMessage('Invalid look category'),
    body('products')
        .isArray()
        .withMessage('Products must be an array')
        .custom((value) => value.length > 0)
        .withMessage('At least one product is required'),
    body('steps')
        .isArray()
        .withMessage('Steps must be an array')
        .custom((value) => value.length > 0)
        .withMessage('At least one step is required'),
    handleValidation
];
