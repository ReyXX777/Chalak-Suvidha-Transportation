const axios = require('axios');
const { GST_API_URL, GST_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

// Helper function to fetch API token
const fetchAuthToken = async () => {
  if (ENVIRONMENT === 'production') {
    const authResponse = await axios.post(
      `${GST_API_URL}/user/login`,
      {
        username: process.env.GST_USERNAME,
        password: process.env.GST_PASSWORD,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );
    return authResponse.data.token;
  }
  return GST_API_TOKEN;
};

// Controller to get GST data
async function getGstData(req, res) {
  const { gstin } = req.body;

  // Validate GSTIN format
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
  if (!gstinRegex.test(gstin)) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid GSTIN format. Expected format: ^\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}$",
    });
  }

  const apiUrl = `${GST_API_URL}/GST/01`;

  try {
    const token = await fetchAuthToken(); // Fetch token based on environment

    // Make API request
    const response = await axios.post(
      apiUrl,
      { gstin },
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
      code: "200",
      message: "Success",
    });
  } catch (error) {
    handleError(error, res);
  }
}

// Helper function to handle errors
const handleError = (error, res) => {
  if (error.response) {
    // Log error details for debugging
    console.error(
      `API Error: Status ${error.response.status}, Message: ${error.response.statusText}`
    );

    if (error.response.status === 400 && error.response.data.error === "record_not_found") {
      res.status(200).json({
        response: [
          {
            response: {
              error: "record_not_found",
              error_description: "No record found: Invalid GSTIN / UID",
            },
            responseStatus: "ERROR",
          },
        ],
        error: false,
        code: "200",
        message: "Success",
      });
    } else {
      res.status(error.response.status).json({
        response: null,
        error: true,
        code: error.response.status.toString(),
        message: error.response.statusText,
      });
    }
  } else {
    // Handle network errors or unexpected issues
    console.error('Network Error:', error.message);
    res.status(502).json({
      response: null,
      error: true,
      code: "502",
      message: "Server is not responding.",
    });
  }
};

module.exports = {
  getGstData,
};
