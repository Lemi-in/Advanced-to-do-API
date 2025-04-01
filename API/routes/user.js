
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');


router.get('/me', authMiddleware, userController.getProfile);


router.patch('/me', authMiddleware, userController.updateProfile);

module.exports = router;
