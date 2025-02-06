// controllers/dataController.js
const axios = require('axios');
const apiConfig = require('../config/apiConfig');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid'); // Added UUID for request tracking
const { performance } = require('perf_hooks'); // Added performance monitoring

// Initialize cache with a TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

// Helper function to fetch API data with token, caching, retry mechanism, request tracking and performance measurement
const getApiData = async (url, token, errorMessage, retries = 3) => {
    const requestId = uuidv4(); // Generate unique request ID
    const startTime = performance.now(); // Record start time

    try {
        if (!token) {
            throw new Error(`Missing API token for URL: ${url}`);
        }

        // Check if the response is cached
        const cachedResponse = cache.get(url);
        if (cachedResponse) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.log(`✅ Serving cached response for ${url} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);
            return cachedResponse;
        }

        console.log(`➡️ Making API request to ${url} (Request ID: ${requestId})`);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Cache the response
        cache.set(url, response.data);
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`✅ Fetched and cached response for ${url} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);

        return response.data;
    } catch (error) {
        if (retries > 0) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.warn(`⚠️ Retrying ${url}... Attempts left: ${retries} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`);
            return getApiData(url, token, errorMessage, retries - 1);
        } else {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.error(`${new Date().toISOString()} - ${errorMessage} (Request ID: ${requestId}, Duration: ${duration.toFixed(2)}ms)`, error.message);
            throw new Error(`${errorMessage}. Details: ${error.message}`);
        }
    }
};

// Controller methods (no changes needed here)
exports.getFastagData = async (req, res) => {
    try {
        const data = await getApiData(
            apiConfig.FASTAG_API_URL,
            apiConfig.FASTAG_API_TOKEN,
            'Error fetching FASTag data'
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSarathiData = async (req, res) => {
    try {
        const data = await getApiData(
            apiConfig.SARATHI_API_URL,
            apiConfig.SARATHI_API_TOKEN,
            'Error fetching Sarathi data'
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdvocateData = async (req, res) => {
    try {
        const data = await getApiData(
            apiConfig.ADVOCATE_API_URL,
            apiConfig.ADVOCATE_API_TOKEN,
            'Error fetching Advocate data'
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPoliceData = async (req, res) => {
    try {
        const data = await getApiData(
            apiConfig.POLICE_API_URL,
            apiConfig.POLICE_API_TOKEN,
            'Error fetching Police data'
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTruckData = async (req, res) => {
    try {
        const data = await getApiData(
            apiConfig.TRUCK_API_URL,
            apiConfig.TRUCK_API_TOKEN,
            'Error fetching Truck data'
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Commit: Added request caching, retry mechanism, request tracking using UUID, and performance monitoring for API calls
