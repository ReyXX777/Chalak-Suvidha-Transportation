import React, { useState } from 'react';

// Mock function to simulate vehicle data API call
const getVehicleData = async (engineNumber) => {
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Basic validation for engine number
  if (!engineNumber || engineNumber.trim().length < 5) {
    throw new Error('Invalid engine number');
  }

  // Create a predictable mock response
  return {
    response: {
      engineNumber: engineNumber,
      registrationNumber: `MH01AB${Math.floor(Math.random() * 9000) + 1000}`,
      make: ['Toyota', 'Honda', 'Maruti', 'Hyundai'][Math.floor(Math.random() * 4)],
      model: ['Sedan', 'SUV', 'Hatchback', 'Truck'][Math.floor(Math.random() * 4)],
      yearOfManufacture: new Date().getFullYear() - Math.floor(Math.random() * 10),
      fuelType: ['Petrol', 'Diesel', 'CNG', 'Electric'][Math.floor(Math.random() * 4)],
      chassisNumber: `CHASSIS${engineNumber.slice(0, 5)}`,
      ownerName: `Owner ${Math.floor(Math.random() * 1000)}`,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive'
    }
  };
};

function VehicleData() {
  const [engineNumber, setEngineNumber] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate engine number before submission
    if (!engineNumber.trim()) {
      setError('Please enter a valid engine number');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getVehicleData(engineNumber);
      
      // Additional error handling for empty or invalid response
      if (!response || !response.response) {
        throw new Error('No data found for the given engine number');
      }
      
      setVehicleData(response.response);
    } catch (error) {
      setError(error.message || 'An error occurred while fetching vehicle data');
      setVehicleData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vehicle-data-container">
      <h1>Vehicle Data Lookup</h1>
      <form onSubmit={handleSubmit} className="vehicle-form">
        <input
          type="text"
          placeholder="Enter Engine Number"
          value={engineNumber}
          onChange={(e) => setEngineNumber(e.target.value)}
          className="vehicle-input"
          required
          minLength="5"
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          className="vehicle-submit-btn"
        >
          {isLoading ? 'Fetching...' : 'Get Vehicle Data'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {vehicleData && (
        <div className="vehicle-details">
          <h2>Vehicle Details</h2>
          <table>
            <tbody>
              <tr>
                <th>Engine Number:</th>
                <td>{vehicleData.engineNumber}</td>
              </tr>
              <tr>
                <th>Registration Number:</th>
                <td>{vehicleData.registrationNumber}</td>
              </tr>
              <tr>
                <th>Make:</th>
                <td>{vehicleData.make}</td>
              </tr>
              <tr>
                <th>Model:</th>
                <td>{vehicleData.model}</td>
              </tr>
              <tr>
                <th>Year of Manufacture:</th>
                <td>{vehicleData.yearOfManufacture}</td>
              </tr>
              <tr>
                <th>Fuel Type:</th>
                <td>{vehicleData.fuelType}</td>
              </tr>
              <tr>
                <th>Chassis Number:</th>
                <td>{vehicleData.chassisNumber}</td>
              </tr>
              <tr>
                <th>Owner Name:</th>
                <td>{vehicleData.ownerName}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>{vehicleData.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VehicleData;