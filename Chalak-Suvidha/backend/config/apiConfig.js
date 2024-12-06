require('dotenv').config();

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  VAHAN_API_URL: process.env.VAHAN_API_URL,
  VAHAN_API_TOKEN: process.env.VAHAN_API_TOKEN,
  SARATHI_API_URL: process.env.SARATHI_API_URL,
  SARATHI_API_TOKEN: process.env.SARATHI_API_TOKEN,
  FASTAG_API_URL: process.env.FASTAG_API_URL,
  FASTAG_API_TOKEN: process.env.FASTAG_API_TOKEN,
  ECHALLAN_API_URL: process.env.ECHALLAN_API_URL,
  ECHALLAN_API_TOKEN: process.env.ECHALLAN_API_TOKEN,
  EWAYBILL_API_URL: process.env.EWAYBILL_API_URL,
  EWAYBILL_API_TOKEN: process.env.EWAYBILL_API_TOKEN,
  GST_API_URL: process.env.GST_API_URL,
  GST_API_TOKEN: process.env.GST_API_TOKEN,
  DIGILOCKER_API_URL: process.env.DIGILOCKER_API_URL,
  DIGILOCKER_API_TOKEN: process.env.DIGILOCKER_API_TOKEN,
  ENVIRONMENT: process.env.ENVIRONMENT
};
// config/apiConfig.js
require('dotenv').config();

module.exports = {
    FASTAG_API_URL: process.env.FASTAG_API_URL,
    FASTAG_API_TOKEN: process.env.FASTAG_API_TOKEN,
    SARATHI_API_URL: process.env.SARATHI_API_URL,
    SARATHI_API_TOKEN: process.env.SARATHI_API_TOKEN,
    ADVOCATE_API_URL: process.env.ADVOCATE_API_URL,
    ADVOCATE_API_TOKEN: process.env.ADVOCATE_API_TOKEN,
    POLICE_API_URL: process.env.POLICE_API_URL,
    POLICE_API_TOKEN: process.env.POLICE_API_TOKEN,
    TRUCK_API_URL: process.env.TRUCK_API_URL,
    TRUCK_API_TOKEN: process.env.TRUCK_API_TOKEN,
};