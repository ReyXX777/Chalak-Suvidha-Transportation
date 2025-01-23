
const axios = require('axios');
const { RateLimiter } = require('limiter');
const { DIGILOCKER_API_URL, DIGILOCKER_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

// Initialize rate limiter to allow 10 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 10, interval: 'second' });

/**
 * Retrieves the API token, either from the environment or by authenticating.
 */
const getToken = async () => {
    try {
        if (ENVIRONMENT === 'production') {
            const authResponse = await axios.post(
                `${DIGILOCKER_API_URL}/user/login`,
                {
                    username: process.env.DIGILOCKER_USERNAME,
                    password: process.env.DIGILOCKER_PASSWORD,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    timeout: 5000, // Set a 5-second timeout for the request
                }
            );
            return authResponse.data.token;
        }
        return DIGILOCKER_API_TOKEN;
    } catch (error) {
        console.error('❌ Error retrieving token:', error.message);
        throw new Error('Failed to retrieve API token.');
    }
};

/**
 * Makes an API request with error handling, rate limiting, and timeout.
 */
const makeApiRequest = async (url, data, token, res, successMessage) => {
    try {
        // Apply rate limiting
        await limiter.removeTokens(1);

        const response = await axios.post(
            url,
            data,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                timeout: 5000, // Set a 5-second timeout for the request
            }
        );
        res.status(200).json({
            response: response.data.response,
            error: false,
            code: '200',
            message: successMessage,
        });
    } catch (error) {
        const status = error.response?.status || 502;
        const statusText = error.response?.statusText || 'Server Error';
        console.error(`❌ API Request Error (${status}):`, error.message);
        res.status(status).json({
            response: null,
            error: true,
            code: status.toString(),
            message: statusText,
        });
    }
};

/**
 * Validates input and returns a consolidated validation result.
 */
const validateInputs = (validations, res) => {
    for (const { field, value, regex, message } of validations) {
        if (!regex.test(value)) {
            res.status(400).json({
                response: null,
                error: true,
                code: '400',
                message: `Invalid ${field}: ${message}`,
            });
            return false;
        }
    }
    return true;
};

module.exports = { getToken, makeApiRequest, validateInputs };
