import React, { useState } from 'react';

// Mock function to simulate API call
const getFastagDataByVehicleNumber = async (vehicleNumber) => {
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple mock data generation based on vehicle number
  if (!vehicleNumber) {
    throw new Error('Vehicle number is required');
  }

  // Create a predictable mock response
  return {
    response: {
      vehicleNumber: vehicleNumber,
      ownerName: `Owner of ${vehicleNumber}`,
      fastagBalance: Math.floor(Math.random() * 5000),
      registrationDate: new Date().toISOString().split('T')[0],
      vehicleType: ['Car', 'Truck', 'Bus', 'Two-wheeler'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.2 ? 'Active' : 'Inactive'
    }
  };
};

function FastagVehicleData() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [fastagData, setFastagData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate vehicle number before submitting
    if (!vehicleNumber.trim()) {
      setError('Please enter a valid vehicle number');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getFastagDataByVehicleNumber(vehicleNumber);
      
      // Add additional error handling for empty or invalid response
      if (!response || !response.response) {
        throw new Error('No data found for the given vehicle number');
      }
      
      setFastagData(response.response);
    } catch (error) {
      setError(error.message || 'An error occurred while fetching vehicle data');
      setFastagData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fastag-container">
      <h1>FASTAG Data Lookup</h1>
      <form onSubmit={handleSubmit} className="fastag-form">
        <input
          type="text"
          placeholder="Enter Vehicle Registration Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className="fastag-input"
          required
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          className="fastag-submit-btn"
        >
          {isLoading ? 'Fetching...' : 'Get FASTAG Data'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {fastagData && (
        <div className="fastag-details">
          <h2>FASTAG Details</h2>
          <table>
            <tbody>
              <tr>
                <th>Vehicle Number:</th>
                <td>{fastagData.vehicleNumber}</td>
              </tr>
              <tr>
                <th>Owner Name:</th>
                <td>{fastagData.ownerName}</td>
              </tr>
              <tr>
                <th>FASTAG Balance:</th>
                <td>₹{fastagData.fastagBalance}</td>
              </tr>
              <tr>
                <th>Registration Date:</th>
                <td>{fastagData.registrationDate}</td>
              </tr>
              <tr>
                <th>Vehicle Type:</th>
                <td>{fastagData.vehicleType}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>{fastagData.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FastagVehicleData;