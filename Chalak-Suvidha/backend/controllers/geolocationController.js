exports.getLocation = (req, res) => {
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

    res.status(200).json({
        error: false,
        code: "200",
        message: "Success",
        data: { latitude: lat, longitude: lon },
    });
};
