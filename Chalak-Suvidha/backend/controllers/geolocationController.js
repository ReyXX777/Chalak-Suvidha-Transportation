
const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with a TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// Reverse geocoding API URL (example using OpenStreetMap Nominatim)
const REVERSE_GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse';

exports.getLocation = async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validate latitude and longitude
    const isValidLatitude = (lat) => lat >= -90 && lat <= 90;
    const isValidLongitude = (lon) => lon >= -180 && lon <= 180;

    if (!latitude || !longitude) {
        return res.status(400).json({
            error: true,
            code: "400",
            message: "Both latitude and longitude are required.",
        });
    }

    // Convert to numbers for validation
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon) || !isValidLatitude(lat) || !isValidLongitude(lon)) {
        return res.status(400).json({
            error: true,
            code: "400",
            message: "Invalid latitude or longitude values. Latitude must be between -90 and 90, and longitude between -180 and 180.",
        });
    }

    // Check if the location data is cached
    const cacheKey = `${lat},${lon}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`✅ Serving cached location data for coordinates: ${cacheKey}`);
        return res.status(200).json({
            error: false,
            code: "200",
            message: "Success (cached)",
            data: cachedData,
        });
    }

    try {
        // Fetch reverse geocoding data
        const response = await axios.get(REVERSE_GEOCODING_API_URL, {
            params: {
                lat: lat,
                lon: lon,
                format: 'json',
            },
            headers: {
                'User-Agent': 'YourAppName/1.0', // Required by Nominatim
            },
        });

        const locationData = {
            latitude: lat,
            longitude: lon,
            address: response.data.display_name,
        };

        // Cache the location data
        cache.set(cacheKey, locationData);
        console.log(`✅ Fetched and cached location data for coordinates: ${cacheKey}`);

        res.status(200).json({
            error: false,
            code: "200",
            message: "Success",
            data: locationData,
        });
    } catch (error) {
        console.error('Error fetching reverse geocoding data:', error.message);
        res.status(500).json({
            error: true,
            code: "500",
            message: "Failed to fetch location data. Please try again later.",
        });
    }
};
