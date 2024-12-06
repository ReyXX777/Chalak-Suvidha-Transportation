import React, { useState } from 'react';
import { getFastagDataByVehicleNumberOrTagId } from '../services/apiIntegrationService';

function FastagTagData() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [tagId, setTagId] = useState('');
  const [fastagData, setFastagData] = useState(null);
  const [error, setError] = useState(null);

  // Validate inputs
  const validateInputs = () => {
    if (!vehicleNumber.trim() && !tagId.trim()) {
      return 'Either Vehicle Registration Number or Tag ID is required.';
    }
    if (vehicleNumber && !/^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/.test(vehicleNumber.trim())) {
      return 'Invalid Vehicle Registration Number format. Expected format: XX00XX0000.';
    }
    if (tagId && !/^\d{13}$/.test(tagId.trim())) {
      return 'Invalid Tag ID. It must be a 13-digit number.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setFastagData(null);
      return;
    }

    try {
      const response = await getFastagDataByVehicleNumberOrTagId(
        vehicleNumber.trim(),
        tagId.trim()
      );
      setFastagData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching FASTAG data.');
      setFastagData(null);
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
      <h1>FASTAG Data by Vehicle Number or Tag ID</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter Vehicle Registration Number"
          value={vehicleNumber}
          onChange={handleInputChange(setVehicleNumber)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Enter Tag ID (13 digits)"
          value={tagId}
          onChange={handleInputChange(setTagId)}
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
          Get FASTAG Data
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {fastagData && (
        <div style={{ marginTop: '20px', background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>
          <h2>FASTAG Details</h2>
          <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(fastagData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default FastagTagData;
