const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, default: '' }, // 🆕 User’s full name
  avatar: { type: String, default: '' }, // 🆕 Avatar image URL
  theme: { type: String, enum: ['light', 'dark'], default: 'light' }, // 🆕 Theme preference
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
