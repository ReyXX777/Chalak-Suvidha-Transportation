import React, { useState } from 'react';
import { getEChallanData } from '../services/apiIntegrationService';

function EChallanData() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [eChallanData, setEChallanData] = useState(null);
  const [error, setError] = useState(null);

  // Validate inputs
  const validateInputs = () => {
    if (!vehicleNumber.trim()) {
      return 'Vehicle registration number is required.';
    }
    if (!/^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/.test(vehicleNumber.trim())) {
      return 'Invalid vehicle registration number format. Expected format: XX00XX0000.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setEChallanData(null);
      return;
    }

    try {
      const response = await getEChallanData(vehicleNumber.trim());
      setEChallanData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching e-challan data.');
      setEChallanData(null);
    }
  };

  const handleInputChange = (e) => {
    setVehicleNumber(e.target.value);
    if (error) {
      setError(null); // Reset error when input changes
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>E-Challan Data</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter Vehicle Registration Number"
          value={vehicleNumber}
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
          Get E-Challan Data
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {eChallanData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>E-Challan Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(eChallanData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default EChallanData;
