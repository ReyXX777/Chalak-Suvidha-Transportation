const axios = require('axios');
const { SARATHI_API_URL, SARATHI_API_TOKEN } = require('../config/apiConfig');

// Helper function to validate inputs
const validateInput = (fieldName, value, regex, res, errorMessage) => {
  if (!regex.test(value)) {
    res.status(400).json({
      response: null,
      error: true,
      code: "400",
      message: `${fieldName}: ${errorMessage}`,
    });
    return false;
  }
  return true;
};

async function getDrivingLicenseData(req, res) {
  const { dlnumber, dob } = req.body;

  // Validation rules
  const dlNumberRegex = /^(([A-Z]{2}-[0-9]{2})|([A-Z]{2}[0-9]{2}))((19|20)[0-9]{2})[0-9]{7}$/;
  const dobRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

  // Validate inputs
  if (
    !validateInput('dlnumber', dlnumber, dlNumberRegex, res, "Format should follow ^(([A-Z]{2}-[0-9]{2})|([A-Z]{2}[0-9]{2}))((19|20)[0-9]{2})[0-9]{7}$") ||
    !validateInput('dob', dob, dobRegex, res, "Format should follow ^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$")
  ) {
    return;
  }

  try {
    const response = await axios.post(
      `${SARATHI_API_URL}/SARATHI/01`,
      { dlnumber, dob },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${SARATHI_API_TOKEN}`,
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
};

module.exports = {
  getDrivingLicenseData,
};
