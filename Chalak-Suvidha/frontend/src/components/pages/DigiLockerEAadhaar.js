import React, { useState } from 'react';
import { getDigiLockerEAadhaar } from '../services/apiIntegrationService';

function DigiLockerEAadhaar() {
  const [token, setToken] = useState('');
  const [eaadhaarData, setEaadhaarData] = useState(null);
  const [error, setError] = useState(null);

  const validateInput = () => {
    if (!token.trim()) {
      return 'Token is required.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      setEaadhaarData(null);
      return;
    }

    try {
      const response = await getDigiLockerEAadhaar(token);
      setEaadhaarData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching EAadhaar data.');
      setEaadhaarData(null);
    }
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
    if (error) {
      setError(null); // Reset error when input changes
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>DigiLocker EAadhaar Data</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter Token"
          value={token}
          onChange={handleTokenChange}
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
          Get EAadhaar Data
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {eaadhaarData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>EAadhaar Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(eaadhaarData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DigiLockerEAadhaar;
