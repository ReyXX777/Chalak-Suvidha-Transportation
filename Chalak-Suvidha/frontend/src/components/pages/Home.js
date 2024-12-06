import React from 'react';

// ServiceCard component to be used in the Home page
const ServiceCard = ({ title, description, onClick }) => {
  const handleClick = () => {
    // Placeholder for future navigation or action
    console.log(`Navigating to ${title} service`);
    // You can add more specific logic here based on your app's requirements
    alert(`Selected Service: ${title}`);
  };

  return (
    <div className="service-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button 
        onClick={handleClick} 
        className="service-card-button"
      >
        Explore
      </button>
    </div>
  );
};

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Chalak Suvidha</h1>
        <p>Your One-Stop Solution for Logistics Transportation</p>
      </header>
      
      <div className="service-cards">
        <ServiceCard 
          title="FASTag" 
          description="Convenient payments for tolls, fuel, parking, and more." 
        />
        <ServiceCard 
          title="VAHAN Suvidha" 
          description="Verify vehicle details, check ownership, and more." 
        />
        <ServiceCard 
          title="SARATHI" 
          description="Access freight transport data and renew permits." 
        />
        <ServiceCard 
          title="Advocate" 
          description="Legal assistance and data." 
        />
        <ServiceCard 
          title="Police" 
          description="Police data and services." 
        />
        <ServiceCard 
          title="Truck Associations" 
          description="Truck association data and services." 
        />
        <ServiceCard 
          title="StarLink" 
          description="Subscribe to StarLink plans." 
        />
        <ServiceCard 
          title="Detect My Location" 
          description="Find your current location." 
        />
      </div>
    </div>
  );
};

export default Home;