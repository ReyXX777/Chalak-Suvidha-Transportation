const axios = require('axios');
const { VAHAN_API_URL, VAHAN_API_TOKEN } = require('../config/apiConfig');

/**
 * Fetches vehicle data based on the engine number.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
async function getVehicleData(req, res) {
  const { enginenumber } = req.body;

  // Validate engine number format
  const engineNumberRegex = /^[a-zA-Z0-9]{1,20}$/;
  if (!engineNumberRegex.test(enginenumber)) {
    return res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: "Invalid engine number. It should match the pattern ^[a-zA-Z0-9]{1,20}$"
    });
  }

  try {
    // Send POST request to the VAHAN API
    const response = await axios.post(
      `${VAHAN_API_URL}/VAHAN/03`,
      { enginenumber },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${VAHAN_API_TOKEN}`,
          'content-type': 'application/json'
        }
      }
    );

    // Respond with success
    res.status(200).json({
      response: response.data.response,
      error: false,
      code: "200",
      message: "Success"
    });
  } catch (error) {
    // Handle specific HTTP errors from the API
    if (error.response) {
      res.status(error.response.status).json({
        response: null,
        error: true,
        code: error.response.status.toString(),
        message: error.response.data?.message || error.response.statusText || "Unknown error occurred"
      });
    } else {
      // Handle network or other unexpected errors
      res.status(502).json({
        response: null,
        error: true,
        code: "502",
        message: "Server is not responding. Please try again later."
      });
    }
  }
}

module.exports = {
  getVehicleData
};
