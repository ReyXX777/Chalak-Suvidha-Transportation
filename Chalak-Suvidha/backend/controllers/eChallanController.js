const axios = require('axios');
const { ECHALLAN_API_URL, ECHALLAN_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

// Helper function to fetch API token
const fetchAuthToken = async () => {
  if (ENVIRONMENT === 'production') {
    const authResponse = await axios.post(
      `${ECHALLAN_API_URL}/user/login`,
      {
        username: process.env.ECHALLAN_USERNAME,
        password: process.env.ECHALLAN_PASSWORD,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );
    return authResponse.data.token;
  }
  return ECHALLAN_API_TOKEN;
};

// Controller to get EChallan Data
async function getEChallanData(req, res) {
  const { vehicleNumber } = req.body;

  // Validate vehicle number format
  const vehicleNumberRegex = /^[a-zA-Z0-9]{5,11}$/;
  if (!vehicleNumberRegex.test(vehicleNumber)) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid vehicleNumber format. Expected format: ^[a-zA-Z0-9]{5,11}$",
    });
  }

  const apiUrl = `${ECHALLAN_API_URL}/ECHALLAN/01`;

  try {
    const token = await fetchAuthToken(); // Get the appropriate token

    // Make the API request
    const response = await axios.post(
      apiUrl,
      { vehicleNumber },
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
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
    if (error.response) {
      // Log the error for debugging
      console.error(
        `API Error: Status ${error.response.status}, Message: ${error.response.statusText}`
      );
      res.status(error.response.status).json({
        response: null,
        error: true,
        code: error.response.status.toString(),
        message: error.response.statusText,
      });
    } else {
      console.error('Network Error:', error.message);
      res.status(502).json({
        response: null,
        error: true,
        code: "502",
        message: "Server is not responding.",
      });
    }
  }
}

module.exports = {
  getEChallanData,
};
