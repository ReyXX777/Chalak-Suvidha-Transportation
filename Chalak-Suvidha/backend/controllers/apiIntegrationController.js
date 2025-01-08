const axios = require('axios');

/**
 * Fetches data from a given API URL with a specified token for authorization.
 * @param {string} url - The API endpoint URL.
 * @param {string} token - Optional API token for authorization.
 * @returns {Promise<object>} - The API response data.
 * @throws {Error} - If the request fails.
 */
const fetchApiData = async (url, token = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching data from ${url}:`, error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
};

module.exports = {
    fetchApiData,
};
