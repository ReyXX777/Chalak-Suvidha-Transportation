import React, { useEffect, useState } from 'react';
import apiIntegrationService from '../services/apiIntegrationService';

const Dashboard = () => {
    const [data, setData] = useState({
        fastagData: [],
        sarathiData: [],
        advocateData: [],
        policeData: [],
        truckData: [],
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    apiIntegrationService.getFastagData(),
                    apiIntegrationService.getSarathiData(),
                    apiIntegrationService.getAdvocateData(),
                    apiIntegrationService.getPoliceData(),
                    apiIntegrationService.getTruckData(),
                ]);

                setData({
                    fastagData: responses[0],
                    sarathiData: responses[1],
                    advocateData: responses[2],
                    policeData: responses[3],
                    truckData: responses[4],
                });
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="data-section">
                <h2>FASTag Data</h2>
                <pre>{JSON.stringify(data.fastagData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Sarathi Data</h2>
                <pre>{JSON.stringify(data.sarathiData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Advocate Data</h2>
                <pre>{JSON.stringify(data.advocateData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Police Data</h2>
                <pre>{JSON.stringify(data.policeData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Truck Data</h2>
                <pre>{JSON.stringify(data.truckData, null, 2)}</pre>
            </div>
        </div>
    );
};

export default Dashboard;
