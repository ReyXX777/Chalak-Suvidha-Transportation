require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Initialize the Express application
const app = express();

// Connect to the database
connectDB().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the application if the database connection fails
});

// Middleware for parsing JSON requests
app.use(express.json());

// API routes
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
