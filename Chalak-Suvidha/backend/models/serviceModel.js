const mongoose = require('mongoose');

/**
 * Schema for Service.
 */
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing whitespace
      maxlength: 100, // Restricts length to improve data consistency
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, // Restricts description length
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('Service', serviceSchema);
