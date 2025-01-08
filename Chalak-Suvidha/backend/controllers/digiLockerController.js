const axios = require('axios');
const { DIGILOCKER_API_URL, DIGILOCKER_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

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
 * Makes an API request with error handling.
 */
const makeApiRequest = async (url, data, token, res, successMessage) => {
    try {
        const response = await axios.post(
            url,
            data,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
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
