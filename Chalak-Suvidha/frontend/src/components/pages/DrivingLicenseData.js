import React, { useState } from 'react';
import { getDrivingLicenseData } from '../services/apiIntegrationService';

function DrivingLicenseData() {
  const [dlNumber, setDlNumber] = useState('');
  const [dob, setDob] = useState('');
  const [licenseData, setLicenseData] = useState(null);
  const [error, setError] = useState(null);

  // Validate inputs
  const validateInputs = () => {
    if (!dlNumber.trim()) {
      return 'Driving License Number is required.';
    }
    if (!dob.trim()) {
      return 'Date of Birth is required.';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return 'Invalid Date of Birth format. Use YYYY-MM-DD.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setLicenseData(null);
      return;
    }

    try {
      const response = await getDrivingLicenseData(dlNumber, dob);
      setLicenseData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching license data.');
      setLicenseData(null);
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
      <h1>Driving License Data</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter Driving License Number"
          value={dlNumber}
          onChange={handleInputChange(setDlNumber)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          placeholder="Enter Date of Birth"
          value={dob}
          onChange={handleInputChange(setDob)}
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
          Get Driving License Data
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {licenseData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>License Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(licenseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DrivingLicenseData;
