import React, { useState } from 'react';
import { getDigiLockerPAN } from '../services/apiIntegrationService';

function DigiLockerPAN() {
  const [panno, setPanno] = useState('');
  const [PANFullName, setPANFullName] = useState('');
  const [consent, setConsent] = useState('');
  const [token, setToken] = useState('');
  const [panData, setPanData] = useState(null);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panno)) {
      return 'Invalid PAN number. It must follow the format: XXXXX1234X.';
    }
    if (!PANFullName.trim()) {
      return 'Full Name is required.';
    }
    if (consent.toUpperCase() !== 'Y') {
      return 'Consent is required (enter "Y").';
    }
    if (!token.trim()) {
      return 'Token is required.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setPanData(null);
      return;
    }

    try {
      const response = await getDigiLockerPAN(panno, PANFullName, consent, token);
      setPanData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching PAN data.');
      setPanData(null);
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
      <h1>DigiLocker PAN Validation</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter PAN Number"
          value={panno}
          onChange={handleInputChange(setPanno)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Enter Full Name"
          value={PANFullName}
          onChange={handleInputChange(setPANFullName)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Enter Consent (Y)"
          value={consent}
          onChange={handleInputChange(setConsent)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Enter Token"
          value={token}
          onChange={handleInputChange(setToken)}
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
          Validate PAN
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {panData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>PAN Validation Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(panData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DigiLockerPAN;
