const express = require('express');
const router = express.Router();
const { createTest, getTests, getTestById } = require('../controllers/testController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('faculty', 'admin'), createTest)
    .get(protect, getTests);

router.route('/:id')
    .get(protect, getTestById);

module.exports = router;
