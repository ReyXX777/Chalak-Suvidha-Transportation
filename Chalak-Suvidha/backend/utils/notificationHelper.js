const Notification = require('../models/notificationModel');

/**
 * Sends a notification to a specific user.
 * @param {string} userId - The ID of the user to send the notification to.
 * @param {string} message - The notification message.
 */
const sendNotification = async (userId, message) => {
    try {
        if (!userId || !message) {
            throw new Error('Both userId and message are required.');
        }

        // Create a new notification instance
        const notification = new Notification({ userId, message });

        // Save the notification to the database
        await notification.save();

        console.log('Notification sent successfully.');
    } catch (error) {
        console.error('Error sending notification:', error.message);
        // Optional: Additional error handling can go here
    }
};

module.exports = { sendNotification };
