const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 */
const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    // Check if the MongoDB URI is provided
    if (!mongoURI) {
        console.error('❌ MongoDB URI is not defined in environment variables.');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,      // Parses MongoDB connection strings properly
            useUnifiedTopology: true,  // Handles MongoDB topology changes
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
