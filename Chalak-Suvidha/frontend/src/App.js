import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

// Import all page components
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import VehicleData from './pages/VehicleData';
import DrivingLicenseData from './pages/DrivingLicenseData';
import FastagVehicleData from './pages/FastagVehicleData';
import FastagTagData from './pages/FastagTagData';
import EChallanData from './pages/EChallanData';
import EwaybillData from './pages/EwaybillData';
import GstData from './pages/GstData';
import DigiLockerAuth from './pages/DigiLockerAuth';
import DigiLockerOTP from './pages/DigiLockerOTP';
import DigiLockerToken from './pages/DigiLockerToken';
import DigiLockerPAN from './pages/DigiLockerPAN';
import DigiLockerEAadhaar from './pages/DigiLockerEAadhaar';

// Centralized route definitions
const routes = [
  { path: '/', component: Home, exact: true, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/vehicle-data', component: VehicleData, name: 'Vehicle Data' },
  { path: '/driving-license-data', component: DrivingLicenseData, name: 'Driving License Data' },
  { path: '/fastag-vehicle-data', component: FastagVehicleData, name: 'FASTAG Vehicle Data' },
  { path: '/fastag-tag-data', component: FastagTagData, name: 'FASTAG Tag Data' },
  { path: '/echallan-data', component: EChallanData, name: 'E-Challan Data' },
  { path: '/ewaybill-data', component: EwaybillData, name: 'EWAYBILL Data' },
  { path: '/gst-data', component: GstData, name: 'GST Data' },
  { path: '/digilocker-auth', component: DigiLockerAuth, name: 'DIGILOCKER Auth' },
  { path: '/digilocker-otp', component: DigiLockerOTP, name: 'DIGILOCKER OTP' },
  { path: '/digilocker-token', component: DigiLockerToken, name: 'DIGILOCKER Token' },
  { path: '/digilocker-pan', component: DigiLockerPAN, name: 'DIGILOCKER PAN' },
  { path: '/digilocker-eaadhaar', component: DigiLockerEAadhaar, name: 'DIGILOCKER EAadhaar' },
];

function App() {
  return (
    <Router>
      <nav>
        {routes.map((route) => (
          <Link key={route.path} to={route.path}>
            {route.name}
          </Link>
        ))}
      </nav>
      <Switch>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact || false}
            component={route.component}
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
