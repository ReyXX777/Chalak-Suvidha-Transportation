# Chalak Suvidha API Documentation

## Authentication

### Register User

**Endpoint:** `/api/auth/register`

**Method:** `POST`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
}
Certainly! Below is a complete working code setup for the "Chalak Suvidha" project based on the directory structure you provided. This setup includes both the backend and frontend components, along with some basic configurations and utility functions.

Backend Code
backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
backend/config/apiConfig.js

module.exports = {
    FASTAG_API_URL: process.env.FASTAG_API_URL,
    SARATHI_API_URL: process.env.SARATHI_API_URL,
    ADVOCATE_API_URL: process.env.ADVOCATE_API_URL,
    POLICE_API_URL: process.env.POLICE_API_URL,
    TRUCK_API_URL: process.env.TRUCK_API_URL,
};
backend/config/dotenv.config.js

require('dotenv').config();
backend/controllers/authController.js

const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
backend/controllers/apiIntegrationController.js

const axios = require('axios');
const apiConfig = require('../config/apiConfig');

exports.getFastagData = async (req, res) => {
    try {
        const response = await axios.get(apiConfig.FASTAG_API_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching FASTag data' });
    }
};

exports.getSarathiData = async (req, res) => {
    try {
        const response = await axios.get(apiConfig.SARATHI_API_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Sarathi data' });
    }
};

exports.getAdvocateData = async (req, res) => {
    try {
        const response = await axios.get(apiConfig.ADVOCATE_API_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Advocate data' });
    }
};

exports.getPoliceData = async (req, res) => {
    try {
        const response = await axios.get(apiConfig.POLICE_API_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Police data' });
    }
};

exports.getTruckData = async (req, res) => {
    try {
        const response = await axios.get(apiConfig.TRUCK_API_URL);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Truck data' });
    }
};
backend/controllers/geolocationController.js

exports.getLocation = (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    res.status(200).json({ latitude, longitude });
};
backend/models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User', userSchema);
backend/models/serviceModel.js

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Service', serviceSchema);
backend/models/notificationModel.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Notification', notificationSchema);
backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
backend/routes/serviceRoutes.js

const express = require('express');
const router = express.Router();
const { getFastagData, getSarathiData, getAdvocateData, getPoliceData, getTruckData } = require('../controllers/apiIntegrationController');

router.get('/fastag', getFastagData);
router.get('/sarathi', getSarathiData);
router.get('/advocate', getAdvocateData);
router.get('/police', getPoliceData);
router.get('/truck', getTruckData);

module.exports = router;
backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { getLocation } = require('../controllers/geolocationController');

router.get('/location', getLocation);

module.exports = router;
backend/routes/index.js

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
backend/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
backend/middleware/validateRequest.js

const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validateRequest;
backend/utils/apiHelper.js

const axios = require('axios');

const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
};

module.exports = { fetchData };
backend/utils/notificationHelper.js

const Notification = require('../models/notificationModel');

const sendNotification = async (userId, message) => {
    try {
        const notification = new Notification({ userId, message });
        await notification.save();
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendNotification };
backend/utils/logger.js

const log = (message) => {
    console.log(`${new Date().toISOString()} - ${message}`);
};

module.exports = { log };
backend/package.json

{
  "name": "chalak-suvidha-backend",
  "version": "1.0.0",
  "description": "Backend for Chalak Suvidha",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "axios": "^1.1.3",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^6.7.0",
    "nodemon": "^2.0.20"
  }
}
backend/server.js

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

connectDB();

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
backend/README.md

# Chalak Suvidha Backend

This is the backend for the Chalak Suvidha project. It provides RESTful APIs for user authentication, service integration, and geolocation.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/chalak-suvidha.git
   cd chalak-suvidha/backend
Install dependencies:

npm install
Create a .env file and add the following environment variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FASTAG_API_URL=https://api.fastag.com/data
SARATHI_API_URL=https://api.sarathi.com/data
ADVOCATE_API_URL=https://api.advocate.com/data
POLICE_API_URL=https://api.police.com/data
TRUCK_API_URL=https://api.truck.com/data
Start the server:

npm start
API Endpoints
Auth
POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user
Services
GET /api/services/fastag - Get FASTag data
GET /api/services/sarathi - Get Sarathi data
GET /api/services/advocate - Get Advocate data
GET /api/services/police - Get Police data
GET /api/services/truck - Get Truck data
Notifications
GET /api/notifications/location - Get location data


### Frontend Code

#### `frontend/public/favicon.ico`, `frontend/public/logo.png`, `frontend/public/manifest.json`
These are static assets. You can create placeholder files for these or use actual files as needed.

#### `frontend/src/components/Navbar.js`
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Chalak Suvidha
                </Link>
                <ul className="navbar-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
frontend/src/components/Footer.js

import React from 'react';

const Footer = () => {
    return (
        <footer>
            <p>&copy; 2024 Chalak Suvidha. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
frontend/src/components/ServiceCard.js

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
frontend/src/pages/Home.js

import React from 'react';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to Chalak Suvidha</h1>
            <p>Your One-Stop Solution for Logistics Transportation</p>
            <div className="service-cards">
                <ServiceCard title="FASTag" description="Convenient payments for tolls, fuel, parking, and more." />
                <ServiceCard title="VAHAN SUVIDHA" description="Verify vehicle details, check ownership, and more." />
                <ServiceCard title="SARATHI" description="Access freight transport data and renew permits." />
                <ServiceCard title="Advocate" description="Legal assistance and data." />
                <ServiceCard title="Police" description="Police data and services." />
                <ServiceCard title="Truck Associations" description="Truck association data and services." />
                <ServiceCard title="StarLink" description="Subscribe to StarLink plans." />
                <ServiceCard title="Detect My Location" description="Find your current location." />
            </div>
        </div>
    );
};

export default Home;
frontend/src/pages/Login.js

import React, { useState } from 'react';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login(email, password);
            console.log(response);
            alert('Login successful');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
frontend/src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import apiIntegrationService from '../services/apiIntegrationService';

const Dashboard = () => {
    const [fastagData, setFastagData] = useState([]);
    const [sarathiData, setSarathiData] = useState([]);
    const [advocateData, setAdvocateData] = useState([]);
    const [policeData, setPoliceData] = useState([]);
    const [truckData, setTruckData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fastagResponse = await apiIntegrationService.getFastagData();
                setFastagData(fastagResponse);

                const sarathiResponse = await apiIntegrationService.getSarathiData();
                setSarathiData(sarathiResponse);

                const advocateResponse = await apiIntegrationService.getAdvocateData();
                setAdvocateData(advocateResponse);

                const policeResponse = await apiIntegrationService.getPoliceData();
                setPoliceData(policeResponse);

                const truckResponse = await apiIntegrationService.getTruckData();
                setTruckData(truckResponse);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="data-section">
                <h2>FASTag Data</h2>
                <pre>{JSON.stringify(fastagData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Sarathi Data</h2>
                <pre>{JSON.stringify(sarathiData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Advocate Data</h2>
                <pre>{JSON.stringify(advocateData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Police Data</h2>
                <pre>{JSON.stringify(policeData, null, 2)}</pre>
            </div>
            <div className="data-section">
                <h2>Truck Data</h2>
                <pre>{JSON.stringify(truckData, null, 2)}</pre>
            </div>
        </div>
    );
};

export default Dashboard;
frontend/src/pages/NotFound.js

import React from 'react';

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFound;
frontend/src/services/authService.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export default {
    register,
    login,
};
frontend/src/services/apiIntegrationService.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const getFastagData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/services/fastag`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch FASTag data');
    }
};

const getSarathiData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/services/sarathi`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Sarathi data');
    }
};

const getAdvocateData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/services/advocate`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Advocate data');
    }
};

const getPoliceData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/services/police`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Police data');
    }
};

const getTruckData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/services/truck`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch Truck data');
    }
};

export default {
    getFastagData,
    getSarathiData,
    getAdvocateData,
    getPoliceData,
    getTruckData,
};
frontend/src/services/geolocationService.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const getLocation = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/notifications/location`, {
            params: { latitude, longitude },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get location');
    }
};

export default {
    getLocation,
};
frontend/src/utils/validation.js

import { body } from 'express-validator';

const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required'),
];

export { registerValidation, loginValidation };
frontend/src/utils/constants.js

export const API_BASE_URL = 'http://localhost:5000';
frontend/src/utils/apiEndpoints.js

export const REGISTER_ENDPOINT = '/api/auth/register';
export const LOGIN_ENDPOINT = '/api/auth/login';
export const FASTAG_ENDPOINT = '/api/services/fastag';
export const SARATHI_ENDPOINT = '/api/services/sarathi';
export const ADVOCATE_ENDPOINT = '/api/services/advocate';
export const POLICE_ENDPOINT = '/api/services/police';
export const TRUCK_ENDPOINT = '/api/services/truck';
export const LOCATION_ENDPOINT = '/api/notifications/location';
frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/global.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
frontend/src/styles/global.css

body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f9;
    color: #333;
    line-height: 1.6;
}

.container {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(to right, #e0c3fc, #db335a);
}

nav {
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-logo {
    font-size: 24px;
    color: #bd1313;
    text-decoration: none;
}

.navbar-links {
    list-style-type: none;
    display: flex;
    gap: 15px;
    margin: 0;
    padding: 0;
}

.navbar-links li {
    margin: 0;
}

.navbar-links a {
    text-decoration: none;
    color: #333;
    transition: color 0.3s ease;
}

.navbar-links a:hover {
    color: #bd1313;
}

main {
    flex-grow: 1;
    padding: 20px;
    background-color: #f4f4f9;
    overflow-y: auto;
}

.service-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.service-card {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.service-card h2 {
    margin-top: 0;
    font-size: 24px;
    color: #8e143d;
}

.service-card p {
    margin: 10px 0;
    color: #555;
}

.login, .dashboard {
    max-width: 400px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.login form, .dashboard form {
    display: flex;
    flex-direction: column;
}

.login label, .dashboard label {
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
}

.login input, .dashboard input, .login textarea, .dashboard textarea {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 16px;
}

.login button, .dashboard button {
    padding: 10px 20px;
    background-color: #840a36;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
}

.login button:hover, .dashboard button:hover {
    background-color: #7e0d29;
}

.not-found {
    text-align: center;
    padding: 50px;
}

footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
frontend/src/styles/dashboard.css

.dashboard {
    max-width: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.data-section {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.data-section h2 {
    margin-top: 0;
    font-size: 24px;
    color: #8e143d;
}

.data-section pre {
    background-color: #f4f4f9;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    white-space: pre-wrap;
}
frontend/src/tests/App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders home link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders login link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Login/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders dashboard link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Dashboard/i);
    expect(linkElement).toBeInTheDocument();
});
frontend/src/tests/Navbar.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

test('renders Navbar with links', () => {
    render(<Navbar />);
    const logoElement = screen.getByText(/Chalak Suvidha/i);
    expect(logoElement).toBeInTheDocument();

    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument();

    const loginLink = screen.getByText(/Login/i);
    expect(loginLink).toBeInTheDocument();

    const dashboardLink = screen.getByText(/Dashboard/i);
    expect(dashboardLink).toBeInTheDocument();
});
frontend/src/tests/Dashboard.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

test('renders Dashboard heading', () => {
    render(<Dashboard />);
    const headingElement = screen.getByText(/Dashboard/i);
    expect(headingElement).toBeInTheDocument();
});
frontend/package.json

{
  "name": "chalak-suvidha-frontend",
  "version": "1.0.0",
  "description": "Frontend for Chalak Suvidha",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "axios": "^1.1.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.4.3",
    "react-scripts": "5.0.1"
  }
}
Documentation
docs/API_Documentation.md

# Chalak Suvidha API Documentation

## Authentication

### Register User

**Endpoint:** `/api/auth/register`

**Method:** `POST`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
}
Response:


{
    "message": "User registered successfully"
}
Login User
Endpoint: /api/auth/login

Method: POST

Request Body:


{
    "email": "john.doe@example.com",
    "password": "securepassword"
}
Response:


{
    "message": "Login successful",
    "user": {
        "name": "John Doe",
        "email": "john.doe@example.com"
    }
}
Services
Get FASTag Data
Endpoint: /api/services/fastag

Method: GET

Response:


{
    "data": [
        {
            "id": 1,
            "name": "FASTag Service 1",
            "description": "Description for FASTag Service 1"
        }
    ]
}
Get Sarathi Data
Endpoint: /api/services/sarathi

Method: GET

Response:


{
    "data": [
        {
            "id": 1,
            "name": "Sarathi Service 1",
            "description": "Description for Sarathi Service 1"
        }
    ]
}
Get Advocate Data
Endpoint: /api/services/advocate

Method: GET

Response:


{
    "data": [
        {
            "id": 1,
            "name": "Advocate Service 1",
            "description": "Description for Advocate Service 1"
        }
    ]
}
Get Police Data
Endpoint: /api/services/police

Method: GET

Response:


{
    "data": [
        {
            "id": 1,
            "name": "Police Service 1",
            "description": "Description for Police Service 1"
        }
    ]
}
Get Truck Data
Endpoint: /api/services/truck

Method: GET

Response:


{
    "data": [
        {
            "id": 1,
            "name": "Truck Service 1",
            "description": "Description for Truck Service 1"
        }
    ]
}
Notifications
Get Location
Endpoint: /api/notifications/location

Method: GET

Query Parameters:

latitude: Latitude coordinate
longitude: Longitude coordinate
Response:


{
    "latitude": "12.3456",
    "longitude": "78.9012"
}


#### `docs/Project_Guide.md`
```markdown
# Chalak Suvidha Project Guide

## Introduction

Chalak Suvidha is a comprehensive web application designed to provide users with easy access to various transportation-related services and information. The application aims to streamline processes and offer convenient solutions for logistics transportation needs.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB instance running locally or a cloud-based MongoDB instance.

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/chalak-suvidha.git
   cd chalak-suvidha/backend
Install Dependencies:

npm install
Create a .env File:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FASTAG_API_URL=https://api.fastag.com/data
SARATHI_API_URL=https://api.sarathi.com/data
ADVOCATE_API_URL=https://api.advocate.com/data
POLICE_API_URL=https://api.police.com/data
TRUCK_API_URL=https://api.truck.com/data
Start the Server:

npm start
Frontend Setup
Navigate to the Frontend Directory:

cd ../frontend
Install Dependencies:

npm install
Start the Development Server:

npm start
Project Structure
Backend
config/: Configuration files (e.g., DB connection, environment variables)
controllers/: Logic for handling API requests
models/: Database models or schemas
routes/: API routes
middleware/: Middleware functions for validation, authentication, etc.
utils/: Helper functions and utilities
tests/: Backend tests (optional)
Frontend
public/: Static assets (e.g., images, icons)
src/components/: Reusable components
src/pages/: Pages of the application
src/services/: API service functions for frontend
src/utils/: Helper functions for the frontend
src/App.js: Main app component
src/index.js: Entry point for React
src/styles/: Global and page-specific styles
src/tests/: Frontend tests (optional)
API Documentation
File: docs/API_Documentation.md
Add the new API endpoint details.


## VAHAN API Endpoints

### Get Vehicle Data

**Endpoint**: `/api/vahan`

**Method**: `POST`

**Request Body**:
```json
{
  "enginenumber": "JF50E76069768"
}
Response:

200 Success:

{
  "response": [
    {
      "response": "<xml_data>",
      "responseStatus": "SUCCESS"
    }
  ],
  "error": false,
  "code": "200",
  "message": "Success"
}
400 Bad Request:

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "Data format failed OR wrong value entered at: enginenumber. Format should follow ^[a-zA-Z0-9]{1,20}$"
}
401 Unauthorized:

{
  "response": null,
  "error": true,
  "code": "401",
  "message": "Unauthorized"
}
500 Internal Server Error:

{
  "response": null,
  "error": true,
  "code": "500",
  "message": "Some internal server error occurred"
}
502 Bad Gateway:

{
  "response": null,
  "error": true,
  "code": "502",
  "message": "Server is not responding."
}


### Summary

- **Backend**: Added `vahanController.js` and `vahanRoutes.js` to handle VAHAN API requests.
- **Frontend**: Added `apiIntegrationService.js`, `VehicleData.js`, and updated `App.js` to include the new page.
- **Documentation**: Updated `API_Documentation.md` with details about the new API endpoint.

This should integrate the VAHAN API functionality into your project effectively.
Documentation
1. API Documentation
File: docs/API_Documentation.md
Add the new API endpoint details.


## SARATHI API Endpoints

### Get Driving License Data

**Endpoint**: `/api/sarathi`

**Method**: `POST`

**Request Body**:
```json
{
  "dlnumber": "GJ04 20120005008",
  "dob": "1987-05-26"
}
Response:

200 Success:

{
  "response": [
    {
      "response": {
        "dldetobj": [
          {
            "transReqObj": null,
            "dlTest": null,
            "dlEndorsementObj": null,
            "objections": null,
            "psvBadgeissued": null,
            "dbLoc": "National Register",
            "dlHzHillObj": null,
            "errorcd": 0,
            "dlCovHistObj": null,
            "dlcovs": null,
            "bioObj": null,
            "idIdpIssuedpPojo": null,
            "dlobj": {
              "dlNo": "GJ0420120005008",
              "dob": "1987-05-26",
              "name": "John Doe",
              "address": "123 Main St, City, State",
              "validity": "2025-05-26"
            },
            "bioImgObj": null,
            "dlHistObj": null
          }
        ]
      },
      "responseStatus": "SUCCESS"
    }
  ],
  "error": false,
  "code": "200",
  "message": "Success"
}
400 Bad Request:

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "Data format failed OR wrong value entered at: dlnumber. Format should follow ^(([A-Z]{2}-[0-9]{2})|([A-Z]{2}[0-9]{2}))((19|20)[0-9]{2})[0-9]{7}$"
}

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "Data format failed OR wrong value entered at: dob. Format should follow ^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$"
}
401 Unauthorized:

{
  "response": null,
  "error": true,
  "code": "401",
  "message": "Unauthorized"
}
500 Internal Server Error:

{
  "response": null,
  "error": true,
  "code": "500",
  "message": "Some internal server error occurred"
}
502 Bad Gateway:

{
  "response": null,
  "error": true,
  "code": "502",
  "message": "Server is not responding."
}


### Summary

- **Backend**: Added `sarathiController.js` and `sarathiRoutes.js` to handle SARATHI API requests.
- **Frontend**: Added `apiIntegrationService.js`, `DrivingLicenseData.js`, and updated `App.js` to include the new page.
- **Documentation**: Updated `API_Documentation.md` with details about the new API endpoint.

This should integrate the SARATHI API functionality into your project effectively.
# FASTAG API Endpoints

### Get FASTAG Data by Vehicle Number

**Endpoint**: `/api/fastag/01`

**Method**: `POST`

**Request Body**:
```json
{
  "vehiclenumber": "GA060000"
}
Response:

200 Success:

{
  "response": [
    {
      "response": {
        "result": "SUCCESS",
        "respCode": "000",
        "ts": "2021-11-01T19:20:47",
        "vehicle": {
          "errCode": "000",
          "vehltxnList": {
            "totalTagsInMsg": "2",
            "msgNum": "1",
            "totalTagsInresponse": "2",
            "totalMsg": "1",
            "txn": [
              {
                "readerReadTime": "2021-10-30 12:26:09.0",
                "seqNo": "68d47e2d-c10f-4f57-b12a-2dfb547ce5c8",
                "laneDirection": "N",
                "tollPlazaGeocode": "11.0001,11.0001",
                "tollPlazaName": "GMR Chillakallu Toll Plaza",
                "vehicleType": "VC7",
                "vehicleRegNo": "MH19JK3923"
              },
              {
                "readerReadTime": "2021-10-30 12:41:23.0",
                "seqNo": "6361cf5f-8ddd-46dd-9593-0aa0e1fd5780",
                "laneDirection": "N",
                "tollPlazaGeocode": "11.0001,11.0001",
                "tollPlazaName": "GMR Chillakallu Toll Plaza",
                "vehicleType": "VC7",
                "vehicleRegNo": "MH19JK3923"
              }
            ]
          }
        }
      },
      "responseStatus": "SUCCESS"
    }
  ],
  "error": "false",
  "code": "200",
  "message": "Success"
}
400 Bad Request:

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "Data format failed OR wrong value entered at: vehiclenumber. Format should follow ^[A-Z0-9]{5,11}$|^[A-Z0-9]{17,20}$"
}
401 Unauthorized:

{
  "response": null,
  "error": true,
  "code": "401",
  "message": "Unauthorized"
}
500 Internal Server Error:

{
  "response": null,
  "error": true,
  "code": "500",
  "message": "Some internal server error occurred"
}
502 Bad Gateway:

{
  "response": null,
  "error": true,
  "code": "502",
  "message": "Server is not responding."
}
Get FASTAG Data by Vehicle Number or Tag ID
Endpoint: /api/fastag/02

Method: POST

Request Body:


{
  "vehiclenumber": "MP09HF4987",
  "tagid": "34161FA8203286140F4064E0"
}
Response:

200 Success:

{
  "response": [
    {
      "response": {
        "result": "SUCCESS",
        "successReqCnt": "1",
        "totReqCnt": "1",
        "respCode": "000",
        "ts": "2024-03-14T14:07:48",
        "vehicle": {
          "errCode": "000",
          "vehicledetails": [
            {
              "detail": [
                {
                  "name": "TAGID",
                  "value": "34161FA820328972020FB320"
                },
                {
                  "name": "REGNUMBER",
                  "value": "MP09HF4987"
                },
                {
                  "name": "TID",
                  "value": "E20034120183C2FFEEB86B77"
                },
                {
                  "name": "VEHICLECLASS",
                  "value": "VC11"
                },
                {
                  "name": "TAGSTATUS",
                  "value": "I"
                },
                {
                  "name": "ISSUEDATE",
                  "value": "2017-07-14"
                },
                {
                  "name": "EXCCODE",
                  "value": "06"
                },
                {
                  "name": "BANKID",
                  "value": "607417"
                },
                {
                  "name": "COMVEHICLE",
                  "value": "T"
                }
              ]
            },
            {
              "detail": [
                {
                  "name": "TAGID",
                  "value": "34161FA8203289720E14EEA0"
                },
                {
                  "name": "REGNUMBER",
                  "value": "MP09HF4987"
                },
                {
                  "name": "TID",
                  "value": "E20034120137FE0006D097ED"
                },
                {
                  "name": "VEHICLECLASS",
                  "value": "VC11"
                },
                {
                  "name": "TAGSTATUS",
                  "value": "I"
                },
                {
                  "name": "ISSUEDATE",
                  "value": "2019-01-09"
                },
                {
                  "name": "EXCCODE",
                  "value": "06"
                },
                {
                  "name": "BANKID",
                  "value": "607417"
                },
                {
                  "name": "COMVEHICLE",
                  "value": "T"
                }
              ]
            },
            {
              "detail": [
                {
                  "name": "TAGID",
                  "value": "34161FA82033E764D9F45341"
                },
                {
                  "name": "REGNUMBER",
                  "value": "MP09HF4987"
                },
                {
                  "name": "TID",
                  "value": "34161FA82033E764D9F45341"
                },
                {
                  "name": "VEHICLECLASS",
                  "value": "VC11"
                },
                {
                  "name": "TAGSTATUS",
                  "value": "A"
                },
                {
                  "name": "ISSUEDATE",
                  "value": "2019-10-11"
                },
                {
                  "name": "EXCCODE",
                  "value": "00"
                },
                {
                  "name": "BANKID",
                  "value": "652210"
                },
                {
                  "name": "COMVEHICLE",
                  "value": "T"
                }
              ]
            }
          ]
        }
      },
      "responseStatus": "SUCCESS"
    }
  ],
  "error": "false",
  "code": "200",
  "message": "Success"
}
400 Bad Request:

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "Data format failed OR wrong value entered at: vehiclenumber. Format should follow ^[A-Z0-9]{5,11}$|^[A-Z0-9]{17,20}$"
}

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "Data format failed OR wrong value entered at: tagid. Format should follow ^[A-Z0-9]{0,25}$"
}

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "vehiclenumber or tagid : must not be Empty or null, Please enter vehiclenumber or tagid"
}

{
  "response": null,
  "error": true,
  "code": "400",
  "message": "Only one of vehiclenumber or tagid should be provided"
}
401 Unauthorized:

{
  "response": null,
  "error": true,
  "code": "401",
  "message": "Unauthorized"
}
500 Internal Server Error:

{
  "response": null,
  "error": true,
  "code": "500",
  "message": "Some internal server error occurred"
}
502 Bad Gateway:

{
  "response": null,
  "error": true,
  "code": "502",
  "message": "Server is not responding."
}
Summary
Backend: Added fastagController.js and fastagRoutes.js to handle FASTAG API requests.
Frontend: Added apiIntegrationService.js, FastagVehicleData.js, FastagTagData.js, and updated App.js to include the new pages.
Documentation: Updated API_Documentation.md with details about the new API endpoints.
This should integrate the FASTAG API functionality into your project effectively.