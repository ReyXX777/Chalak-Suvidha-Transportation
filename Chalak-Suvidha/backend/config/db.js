const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MongoDB URI is not defined in environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true, // Optional: Not needed in recent versions of Mongoose
            // useUnifiedTopology: true, // Optional: Not needed in recent versions of Mongoose
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;