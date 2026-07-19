const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', protect, adminOnly, register);
router.get('/me', protect, getMe);

module.exports = router;
