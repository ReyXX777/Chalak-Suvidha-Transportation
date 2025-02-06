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
        // Connect to MongoDB with timeout and retry logic
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,      // Parses MongoDB connection strings properly
            useUnifiedTopology: true,  // Handles MongoDB topology changes
            connectTimeoutMS: 5000,    // Timeout after 5 seconds
            retryWrites: true,         // Enable retryable writes
            retryReads: true,          // Enable retryable reads
            maxPoolSize: 10,           // Added: Maximum number of connections in the pool
            socketTimeoutMS: 45000,    // Added: Close sockets after 45 seconds of inactivity
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
