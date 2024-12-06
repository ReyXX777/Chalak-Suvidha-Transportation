const mongoose = require('mongoose');

/**
 * Schema for User.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // Custom error message
      trim: true, // Removes leading/trailing whitespace
      maxlength: 50, // Restrict maximum length
    },
    email: {
      type: String,
      required: [true, 'Email is required'], // Custom error message
      unique: true,
      trim: true,
      lowercase: true, // Ensure consistency in email storage
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Validation regex
    },
    password: {
      type: String,
      required: [true, 'Password is required'], // Custom error message
      minlength: 8, // Enforce minimum length for security
      select: false, // Exclude password by default in queries for security
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('User', userSchema);
