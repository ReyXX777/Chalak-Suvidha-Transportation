
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Environment variables for security
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshSecretKey';

// Password strength validation
const validatePasswordStrength = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate password strength
        if (!validatePasswordStrength(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Error during user login:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        // Generate a new access token
        const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error during token refresh:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
