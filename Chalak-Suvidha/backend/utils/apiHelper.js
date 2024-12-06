// Import the axios library for making HTTP requests
const axios = require('axios');

/**
 * Fetches data from the specified URL.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} The data from the response.
 * @throws {Error} If there's an error fetching the data.
 */
const fetchData = async (url) => {
    try {
        // Attempt to get data from the URL
        const response = await axios.get(url);
        // Return only the data part of the response
        return response.data;
    } catch (error) {
        // Log the error for debugging purposes (optional)
        console.error(`Error fetching data from ${url}:`, error.message);
        // Throw a new error with a descriptive message
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
};

// Export the fetchData function for use in other modules
module.exports = { fetchData };