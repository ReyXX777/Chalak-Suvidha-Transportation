import React, { useState } from 'react';
import { getDigiLockerAuth } from '../services/apiIntegrationService';

function DigiLockerAuth() {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [consent, setConsent] = useState('');
  const [authData, setAuthData] = useState(null);
  const [error, setError] = useState(null);

  // Validate form inputs
  const validateInputs = () => {
    if (!uid || !/^\d{12}$/.test(uid)) return 'Invalid UID. It must be a 12-digit number.';
    if (!name.trim()) return 'Name is required.';
    if (!dob || !/^\d{4}\d{2}\d{2}$/.test(dob)) return 'Invalid DOB. Use YYYYMMDD format.';
    if (!['M', 'F', 'T'].includes(gender.toUpperCase())) return 'Gender must be M, F, or T.';
    if (!mobile || !/^\d{10}$/.test(mobile)) return 'Invalid mobile number. It must be 10 digits.';
    if (consent.toUpperCase() !== 'Y') return 'Consent is required (enter "Y").';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setAuthData(null);
      return;
    }
    try {
      const response = await getDigiLockerAuth(uid, name, dob, gender, mobile, consent);
      setAuthData(response.response);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
      setAuthData(null);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>DigiLocker Authentication</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter UID (12 digits)"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          placeholder="Enter DOB"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="T">Transgender</option>
        </select>
        <input
          type="tel"
          placeholder="Enter Mobile (10 digits)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Consent (Y)"
          value={consent}
          onChange={(e) => setConsent(e.target.value)}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: '#FFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Authenticate
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {authData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Authentication Details</h2>
          <pre style={{ background: '#F4F4F4', padding: '10px', borderRadius: '5px' }}>{JSON.stringify(authData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DigiLockerAuth;
