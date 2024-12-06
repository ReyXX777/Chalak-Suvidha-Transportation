/**
 * Logs a message with a timestamp.
 * @param {string} message - The message to log.
 */
const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${message}`);
};

// Export the log function for use in other modules
module.exports = { log };