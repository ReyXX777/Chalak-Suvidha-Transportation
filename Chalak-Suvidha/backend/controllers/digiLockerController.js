const axios = require('axios');
const { RateLimiter } = require('limiter');
const { v4: uuidv4 } = require('uuid'); // Added UUID for request tracking
const { performance } = require('perf_hooks'); // Added performance monitoring
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
 * Makes an API request with error handling, rate limiting, and timeout, request tracking and performance measurement.
 */
const makeApiRequest = async (url, data, token, res, successMessage) => {
    const requestId = uuidv4(); // Generate unique request ID
    const startTime = performance.now(); // Record start time

    try {
        // Apply rate limiting
        await limiter.removeTokens(1);

        console.log(`➡️ Making API request to ${url} (Request ID: ${requestId})`);

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

        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`✅ API request successful to ${url} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);

        res.status(200).json({
            response: response.data.response,
            error: false,
            code: '200',
            message: successMessage,
            requestId: requestId, // Include request ID in the response
            duration: duration.toFixed(2) // Include duration in the response
        });
    } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const status = error.response?.status || 502;
        const statusText = error.response?.statusText || 'Server Error';
        console.error(`❌ API Request Error (${status}):`, error.message, `(Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);
        res.status(status).json({
            response: null,
            error: true,
            code: status.toString(),
            message: statusText,
            requestId: requestId, // Include request ID in the error response
            duration: duration.toFixed(2) // Include duration in the error response
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

