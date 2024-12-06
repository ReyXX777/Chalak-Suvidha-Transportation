import React, { useState } from 'react';
import { getDigiLockerOTP } from '../services/apiIntegrationService';

function DigiLockerOTP() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [codeChallenge, setCodeChallenge] = useState('');
  const [codeVerifier, setCodeVerifier] = useState('');
  const [otpData, setOtpData] = useState(null);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    if (!/^\d{10}$/.test(mobile)) return 'Invalid mobile number. It must be 10 digits.';
    if (!otp.trim()) return 'OTP is required.';
    if (!codeChallenge.trim()) return 'Code Challenge is required.';
    if (!codeVerifier.trim()) return 'Code Verifier is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setOtpData(null);
      return;
    }

    try {
      const response = await getDigiLockerOTP(mobile, otp, codeChallenge, codeVerifier);
      setOtpData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred during OTP validation.');
      setOtpData(null);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) {
      setError(null); // Reset error when input changes
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>DigiLocker OTP Validation</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="tel"
          placeholder="Enter Mobile (10 digits)"
          value={mobile}
          onChange={handleInputChange(setMobile)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleInputChange(setOtp)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Enter Code Challenge"
          value={codeChallenge}
          onChange={handleInputChange(setCodeChallenge)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Enter Code Verifier"
          value={codeVerifier}
          onChange={handleInputChange(setCodeVerifier)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#FFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Validate OTP
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {otpData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>OTP Validation Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(otpData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DigiLockerOTP;
