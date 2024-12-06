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