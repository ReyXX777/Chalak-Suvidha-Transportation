import React, { useState } from 'react';

// Mock function to simulate GST data API call
const getGstData = async (gstin) => {
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate GSTIN basic format
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstin || !gstinRegex.test(gstin)) {
    throw new Error('Invalid GSTIN format');
  }

  // Create a predictable mock response
  return {
    response: {
      gstin: gstin,
      businessName: `Business of ${gstin.slice(2, 7)}`,
      registrationDate: new Date().toISOString().split('T')[0],
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      businessType: ['Proprietorship', 'Partnership', 'Private Limited', 'Public Limited'][Math.floor(Math.random() * 4)],
      turnover: Math.floor(Math.random() * 10000000),
      stateJurisdiction: ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata'][Math.floor(Math.random() * 4)]
    }
  };
};

function GstData() {
  const [gstin, setGstin] = useState('');
  const [gstData, setGstData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate GSTIN before submission
    if (!gstin.trim()) {
      setError('Please enter a valid GSTIN');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getGstData(gstin);
      
      // Additional error handling for empty or invalid response
      if (!response || !response.response) {
        throw new Error('No data found for the given GSTIN');
      }
      
      setGstData(response.response);
    } catch (error) {
      setError(error.message || 'An error occurred while fetching GST data');
      setGstData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gst-container">
      <h1>GST Data Lookup</h1>
      <form onSubmit={handleSubmit} className="gst-form">
        <input
          type="text"
          placeholder="Enter GSTIN"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          className="gst-input"
          required
          pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
          title="Enter a valid 15-digit GSTIN"
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          className="gst-submit-btn"
        >
          {isLoading ? 'Fetching...' : 'Get GST Data'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {gstData && (
        <div className="gst-details">
          <h2>GST Details</h2>
          <table>
            <tbody>
              <tr>
                <th>GSTIN:</th>
                <td>{gstData.gstin}</td>
              </tr>
              <tr>
                <th>Business Name:</th>
                <td>{gstData.businessName}</td>
              </tr>
              <tr>
                <th>Registration Date:</th>
                <td>{gstData.registrationDate}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>{gstData.status}</td>
              </tr>
              <tr>
                <th>Business Type:</th>
                <td>{gstData.businessType}</td>
              </tr>
              <tr>
                <th>Turnover:</th>
                <td>₹{gstData.turnover.toLocaleString()}</td>
              </tr>
              <tr>
                <th>State Jurisdiction:</th>
                <td>{gstData.stateJurisdiction}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GstData;