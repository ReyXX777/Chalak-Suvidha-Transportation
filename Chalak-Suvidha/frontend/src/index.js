import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot in React 18

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
