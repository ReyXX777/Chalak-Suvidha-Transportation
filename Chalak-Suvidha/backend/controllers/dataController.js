// controllers/dataController.js
const axios = require('axios');
const apiConfig = require('../config/apiConfig');

// Helper function to fetch API data with token
const getApiData = async (url, token, errorMessage) => {
    try {
        if (!token) {
            throw new Error(`Missing API token for URL: ${url}`);
        }
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`${new Date().toISOString()} - ${errorMessage}`, error.message);
        throw new Error(`${errorMessage}. Details: ${error.message}`);
    }
};

// Controller methods
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
