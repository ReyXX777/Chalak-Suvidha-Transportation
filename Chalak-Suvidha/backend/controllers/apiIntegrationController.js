const axios = require('axios');
const apiConfig = require('../config/apiConfig');

// Reusable function to fetch API data
const fetchApiData = async (url, res, errorMessage) => {
    try {
        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        res.status(500).json({
            message: errorMessage,
            error: error.message,
        });
    }
};

exports.getFastagData = (req, res) => {
    fetchApiData(apiConfig.FASTAG_API_URL, res, 'Error fetching FASTag data');
};

exports.getSarathiData = (req, res) => {
    fetchApiData(apiConfig.SARATHI_API_URL, res, 'Error fetching Sarathi data');
};

exports.getAdvocateData = (req, res) => {
    fetchApiData(apiConfig.ADVOCATE_API_URL, res, 'Error fetching Advocate data');
};

exports.getPoliceData = (req, res) => {
    fetchApiData(apiConfig.POLICE_API_URL, res, 'Error fetching Police data');
};

exports.getTruckData = (req, res) => {
    fetchApiData(apiConfig.TRUCK_API_URL, res, 'Error fetching Truck data');
};
