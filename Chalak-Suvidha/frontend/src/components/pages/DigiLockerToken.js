import React, { useState } from 'react';
import { getDigiLockerToken } from '../services/apiIntegrationService';

function DigiLockerToken() {
  const [code, setCode] = useState('');
  const [codeVerifier, setCodeVerifier] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    if (!code.trim()) {
      return 'Code is required.';
    }
    if (!codeVerifier.trim()) {
      return 'Code Verifier is required.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setTokenData(null);
      return;
    }

    try {
      const response = await getDigiLockerToken(code, codeVerifier);
      setTokenData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while generating the token.');
      setTokenData(null);
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
      <h1>DigiLocker Token Generation</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter Code"
          value={code}
          onChange={handleInputChange(setCode)}
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
          Generate Token
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {tokenData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>Token Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(tokenData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DigiLockerToken;
