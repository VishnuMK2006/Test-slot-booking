const express = require('express');
const router = express.Router();
const { registerForTest, startAttempt, submitAttempt, getMyRegistrations, getMyAttempts } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/:testId', protect, registerForTest);
router.post('/attempt/:testId', protect, startAttempt);
router.post('/submit/:attemptId', protect, submitAttempt);
router.get('/registrations', protect, getMyRegistrations);
router.get('/attempts', protect, getMyAttempts);

module.exports = router;
