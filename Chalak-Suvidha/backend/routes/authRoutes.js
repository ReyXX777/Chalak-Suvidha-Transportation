const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

/**
 * Route to register a new user.
 * @method POST
 */
router.post('/register', registerUser);

/**
 * Route to log in an existing user.
 * @method POST
 */
router.post('/login', loginUser);

module.exports = router;
