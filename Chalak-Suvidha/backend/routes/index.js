const express = require('express');
const router = express.Router();

// Authentication routes
const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

// Service related routes
const serviceRoutes = require('./serviceRoutes');
router.use('/services', serviceRoutes);

// Notification routes
const notificationRoutes = require('./notificationRoutes');
router.use('/notifications', notificationRoutes);

// API routes
router.use('/api', require('./vahanRoutes')); // Vahan related API routes
router.use('/api', require('./sarathiRoutes')); // Sarathi related API routes
router.use('/api', require('./fastagRoutes')); // FASTag related API routes
router.use('/api', require('./eChallanRoutes')); // e-Challan related API routes
router.use('/api', require('./ewaybillRoutes')); // E-waybill related API routes
router.use('/api', require('./gstRoutes')); // GST related API routes
router.use('/api', require('./digiLockerRoutes')); // DigiLocker related API routes

module.exports = router;