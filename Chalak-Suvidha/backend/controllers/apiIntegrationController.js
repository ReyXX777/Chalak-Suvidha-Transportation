// Commit: Added request caching and rate limiting to API requests

const axios = require('axios');
const NodeCache = require('node-cache');
const { RateLimiter } = require('limiter');

// Initialize cache with a TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

// Initialize rate limiter to allow 10 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 10, interval: 'second' });

/**
 * Fetches data from a given API URL with a specified token for authorization.
 * @param {string} url - The API endpoint URL.
 * @param {string} token - Optional API token for authorization.
 * @returns {Promise<object>} - The API response data.
 * @throws {Error} - If the request fails.
 */
const fetchApiData = async (url, token = null) => {
    // Check if the response is cached
    const cachedResponse = cache.get(url);
    if (cachedResponse) {
        console.log(`✅ Serving cached response for ${url}`);
        return cachedResponse;
    }

    try {
        // Apply rate limiting
        await limiter.removeTokens(1);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, { headers });

        // Cache the response
        cache.set(url, response.data);
        console.log(`✅ Fetched and cached response for ${url}`);

        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching data from ${url}:`, error.message);
        throw new Error(error.response?.data?.message || error.message);
    }
};

module.exports = {
    fetchApiData,
};
