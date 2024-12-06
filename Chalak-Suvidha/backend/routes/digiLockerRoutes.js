const express = require('express');
const router = express.Router();
const {
  getDigiLockerAuth,
  getDigiLockerOTP,
  getDigiLockerToken,
  getDigiLockerPAN,
  getDigiLockerEAadhaar,
} = require('../controllers/digiLockerController');

/**
 * Route to initiate DigiLocker authentication.
 * @method POST
 */
router.post('/digilocker/auth', getDigiLockerAuth);

/**
 * Route to handle OTP for DigiLocker.
 * @method POST
 */
router.post('/digilocker/otp', getDigiLockerOTP);

/**
 * Route to fetch DigiLocker token.
 * @method POST
 */
router.post('/digilocker/token', getDigiLockerToken);

/**
 * Route to fetch PAN details from DigiLocker.
 * @method POST
 */
router.post('/digilocker/pan', getDigiLockerPAN);

/**
 * Route to fetch e-Aadhaar details from DigiLocker.
 * @method POST
 */
router.post('/digilocker/eaadhaar', getDigiLockerEAadhaar);

module.exports = router;
