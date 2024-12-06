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