import React, { useState } from 'react';
import { getEwaybillData } from '../services/apiIntegrationService';

function EwaybillData() {
  const [ewbNo, setEwbNo] = useState('');
  const [ewaybillData, setEwaybillData] = useState(null);
  const [error, setError] = useState(null);

  // Validate inputs
  const validateInputs = () => {
    if (!ewbNo.trim()) {
      return 'E-Waybill number is required.';
    }
    if (!/^\d{12}$/.test(ewbNo)) {
      return 'Invalid E-Waybill number. It must be a 12-digit number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setEwaybillData(null);
      return;
    }

    try {
      const response = await getEwaybillData(ewbNo.trim());
      setEwaybillData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching E-Waybill data.');
      setEwaybillData(null);
    }
  };

  const handleInputChange = (e) => {
    setEwbNo(e.target.value);
    if (error) {
      setError(null); // Reset error when input changes
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>E-Waybill Data</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter E-Waybill Number"
          value={ewbNo}
          onChange={handleInputChange}
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
          Get E-Waybill Data
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {ewaybillData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>E-Waybill Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(ewaybillData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default EwaybillData;
