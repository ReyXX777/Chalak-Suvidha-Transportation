const axios = require('axios');
const { DIGILOCKER_API_URL, DIGILOCKER_API_TOKEN, ENVIRONMENT } = require('../config/apiConfig');

// Helper function to get API token
const getToken = async () => {
  if (ENVIRONMENT === 'production') {
    const authResponse = await axios.post(
      `${DIGILOCKER_API_URL}/user/login`,
      {
        username: process.env.DIGILOCKER_USERNAME,
        password: process.env.DIGILOCKER_PASSWORD,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return authResponse.data.token;
  }
  return DIGILOCKER_API_TOKEN;
};

// Helper function for input validation
const validateInput = (field, value, regex, res, message) => {
  if (!regex.test(value)) {
    res.status(400).json({
      response: null,
      error: true,
      code: '400',
      message: `Invalid ${field}: ${message}`,
    });
    return false;
  }
  return true;
};

// Helper function to handle API requests
const makeApiRequest = async (url, data, token, res, successMessage) => {
  try {
    const response = await axios.post(
      url,
      data,
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
      code: '200',
      message: successMessage,
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        response: null,
        error: true,
        code: error.response.status.toString(),
        message: error.response.statusText,
      });
    } else {
      res.status(502).json({
        response: null,
        error: true,
        code: '502',
        message: 'Server is not responding.',
      });
    }
  }
};

// Controller for DigiLocker Auth
async function getDigiLockerAuth(req, res) {
  const { uid, name, dob, gender, mobile, consent } = req.body;

  const validations = [
    { field: 'uid', value: uid, regex: /^[0-9]{12}$/, message: '12-digit number' },
    { field: 'name', value: name, regex: /^[a-zA-Z ]*$/, message: 'letters only' },
    { field: 'dob', value: dob, regex: /^[0-9]{8}$/, message: 'YYYYMMDD format' },
    { field: 'gender', value: gender, regex: /^[MFT]{1}$/, message: 'M, F, or T' },
    { field: 'mobile', value: mobile, regex: /^[0-9]{10}$/, message: '10-digit number' },
    { field: 'consent', value: consent, regex: /^[Y]{1}$/, message: 'Y' },
  ];

  for (const validation of validations) {
    if (!validateInput(validation.field, validation.value, validation.regex, res, validation.message)) {
      return;
    }
  }

  const apiUrl = `${DIGILOCKER_API_URL}/DIGILOCKER/01`;
  const token = await getToken();
  await makeApiRequest(apiUrl, { uid, name, dob, gender, mobile, consent }, token, res, 'Authentication successful');
}

// Controller for DigiLocker OTP
async function getDigiLockerOTP(req, res) {
  const { mobile, otp, code_challenge, code_verifier } = req.body;

  const validations = [
    { field: 'mobile', value: mobile, regex: /^[0-9]{10}$/, message: '10-digit number' },
    { field: 'otp', value: otp, regex: /^[0-9]{6}$/, message: '6-digit number' },
    { field: 'code_challenge', value: code_challenge, regex: /^[a-zA-Z0-9!@#|\$%\^\&*+=._-]*$/, message: 'valid characters' },
    { field: 'code_verifier', value: code_verifier, regex: /^[a-zA-Z0-9!@#|\$%\^\&*+=._-]*$/, message: 'valid characters' },
  ];

  for (const validation of validations) {
    if (!validateInput(validation.field, validation.value, validation.regex, res, validation.message)) {
      return;
    }
  }

  const apiUrl = `${DIGILOCKER_API_URL}/DIGILOCKER/02`;
  const token = await getToken();
  await makeApiRequest(apiUrl, { mobile, otp, code_challenge, code_verifier }, token, res, 'OTP verified successfully');
}

// Controller for DigiLocker Token
async function getDigiLockerToken(req, res) {
  const { code, code_verifier } = req.body;

  const validations = [
    { field: 'code', value: code, regex: /^[a-zA-Z0-9!@#|\$%\^\&*+=._-]*$/, message: 'valid characters' },
    { field: 'code_verifier', value: code_verifier, regex: /^[a-zA-Z0-9!@#|\$%\^\&*+=._-]*$/, message: 'valid characters' },
  ];

  for (const validation of validations) {
    if (!validateInput(validation.field, validation.value, validation.regex, res, validation.message)) {
      return;
    }
  }

  const apiUrl = `${DIGILOCKER_API_URL}/DIGILOCKER/03`;
  const token = await getToken();
  await makeApiRequest(apiUrl, { code, code_verifier }, token, res, 'Token retrieved successfully');
}

// Other controllers (getDigiLockerPAN, getDigiLockerEAadhaar) follow a similar pattern...

module.exports = {
  getDigiLockerAuth,
  getDigiLockerOTP,
  getDigiLockerToken,
  // Export other controllers as well
};
