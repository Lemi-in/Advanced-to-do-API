// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// GET /api/auth/me
router.get('/me', authMiddleware, userController.getProfile);

// PATCH /api/auth/me
router.patch('/me', authMiddleware, userController.updateProfile);

module.exports = router;
