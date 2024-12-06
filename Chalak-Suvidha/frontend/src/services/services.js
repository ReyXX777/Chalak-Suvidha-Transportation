// Mock API Client Simulation
const apiClient = {
  post: async (endpoint, data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response generator based on endpoint
    switch (endpoint) {
      case '/api/vahan':
        return {
          data: {
            vehicleNumber: data.enginenumber,
            make: 'Toyota',
            model: 'Sedan',
            registrationYear: 2020,
            ownerName: 'John Doe'
          }
        };

      case '/api/sarathi':
        return {
          data: {
            dlNumber: data.dlnumber,
            name: 'John Doe',
            dob: data.dob,
            validUpto: '2030-12-31'
          }
        };

      case '/api/fastag/01':
        return {
          data: {
            vehicleNumber: data.vehiclenumber,
            balance: 5000,
            lastTransaction: new Date().toISOString()
          }
        };

      case '/api/fastag/02':
        return {
          data: {
            vehicleNumber: data.vehiclenumber,
            tagId: data.tagid,
            status: 'Active'
          }
        };

      case '/api/echallan':
        return {
          data: {
            vehicleNumber: data.vehicleNumber,
            pendingChallan: 2,
            totalAmount: 5000
          }
        };

      case '/api/ewaybill':
        return {
          data: {
            ewbNo: data.ewbNo,
            status: 'Generated',
            validUpto: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        };

      case '/api/gst':
        return {
          data: {
            gstin: data.gstin,
            businessName: 'Sample Business',
            registrationStatus: 'Active'
          }
        };

      case '/api/digilocker/auth':
        return {
          data: {
            status: 'Authentication Initiated',
            requestId: 'REQ_' + Math.random().toString(36).substr(2, 9)
          }
        };

      case '/api/digilocker/otp':
        return {
          data: {
            status: 'OTP Verified',
            token: 'MOCK_TOKEN_' + Math.random().toString(36).substr(2, 9)
          }
        };

      case '/api/digilocker/token':
        return {
          data: {
            accessToken: 'ACCESS_' + Math.random().toString(36).substr(2, 9),
            refreshToken: 'REFRESH_' + Math.random().toString(36).substr(2, 9)
          }
        };

      case '/api/digilocker/pan':
        return {
          data: {
            panNumber: data.panno,
            name: data.PANFullName,
            dob: '1990-01-01'
          }
        };

      case '/api/digilocker/eaadhaar':
        return {
          data: {
            aadhaarNumber: 'XXXX XXXX ' + Math.floor(1000 + Math.random() * 9000),
            name: 'John Doe',
            dob: '1990-01-01'
          }
        };

      default:
        throw new Error('Endpoint not found');
    }
  }
};

// General function to handle API responses
async function handleApiRequest(endpoint, data) {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'An error occurred while processing the request'
    );
  }
}

// Vehicle Data
export const getVehicleData = (engineNumber) =>
  handleApiRequest('/api/vahan', { enginenumber: engineNumber });

// Driving License Data
export const getDrivingLicenseData = (dlNumber, dob) =>
  handleApiRequest('/api/sarathi', { dlnumber: dlNumber, dob });

// FASTag Data by Vehicle Number
export const getFastagDataByVehicleNumber = (vehicleNumber) =>
  handleApiRequest('/api/fastag/01', { vehiclenumber: vehicleNumber });

// FASTag Data by Vehicle Number or Tag ID
export const getFastagDataByVehicleNumberOrTagId = (vehicleNumber, tagId) =>
  handleApiRequest('/api/fastag/02', { vehiclenumber: vehicleNumber, tagid: tagId });

// E-Challan Data
export const getEChallanData = (vehicleNumber) =>
  handleApiRequest('/api/echallan', { vehicleNumber });

// E-Waybill Data
export const getEwaybillData = (ewbNo) =>
  handleApiRequest('/api/ewaybill', { ewbNo });

// GST Data
export const getGstData = (gstin) =>
  handleApiRequest('/api/gst', { gstin });

// DigiLocker Authentication
export const getDigiLockerAuth = (uid, name, dob, gender, mobile, consent) =>
  handleApiRequest('/api/digilocker/auth', { uid, name, dob, gender, mobile, consent });

// DigiLocker OTP
export const getDigiLockerOTP = (mobile, otp, codeChallenge, codeVerifier) =>
  handleApiRequest('/api/digilocker/otp', {
    mobile,
    otp,
    code_challenge: codeChallenge,
    code_verifier: codeVerifier,
  });

// DigiLocker Token
export const getDigiLockerToken = (code, codeVerifier) =>
  handleApiRequest('/api/digilocker/token', { code, code_verifier: codeVerifier });

// DigiLocker PAN Data
export const getDigiLockerPAN = (panno, PANFullName, consent, token) =>
  handleApiRequest('/api/digilocker/pan', { panno, PANFullName, consent, token });

// DigiLocker e-Aadhaar
export const getDigiLockerEAadhaar = (token) =>
  handleApiRequest('/api/digilocker/eaadhaar', { token });

export default {
  getVehicleData,
  getDrivingLicenseData,
  getFastagDataByVehicleNumber,
  getFastagDataByVehicleNumberOrTagId,
  getEChallanData,
  getEwaybillData,
  getGstData,
  getDigiLockerAuth,
  getDigiLockerOTP,
  getDigiLockerToken,
  getDigiLockerPAN,
  getDigiLockerEAadhaar
};