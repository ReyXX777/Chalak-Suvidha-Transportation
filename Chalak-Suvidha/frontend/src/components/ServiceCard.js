import React from 'react';

const ServiceCard = ({ title, description }) => {
    return (
        <div className="service-card">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
};

export default ServiceCard;