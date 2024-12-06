import { body } from 'express-validator';

// Validation for User Registration
const registerValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

// Validation for User Login
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Export validations
export { registerValidation, loginValidation };
import express from 'express';
import { registerValidation, loginValidation } from './validations';
import { validationResult } from 'express-validator';

const router = express.Router();

router.post('/register', registerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Proceed with registration logic
    res.send('User registered successfully!');
});

router.post('/login', loginValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Proceed with login logic
    res.send('User logged in successfully!');
});

export default router;

