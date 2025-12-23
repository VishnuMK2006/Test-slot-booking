const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, loginWithBarcode } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login-barcode', loginWithBarcode);
router.get('/profile', protect, getMe);

module.exports = router;
