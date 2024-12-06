// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'; // Use environment variables for flexibility

// Auth Endpoints
export const REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/register`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`;

// Service Endpoints
export const FASTAG_ENDPOINT = `${API_BASE_URL}/api/services/fastag`;
export const SARATHI_ENDPOINT = `${API_BASE_URL}/api/services/sarathi`;
export const ADVOCATE_ENDPOINT = `${API_BASE_URL}/api/services/advocate`;
export const POLICE_ENDPOINT = `${API_BASE_URL}/api/services/police`;
export const TRUCK_ENDPOINT = `${API_BASE_URL}/api/services/truck`;

// Notification Endpoints
export const LOCATION_ENDPOINT = `${API_BASE_URL}/api/notifications/location`;
