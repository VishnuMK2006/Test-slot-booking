const Test = require('../models/Test');

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private (Faculty only)
const createTest = async (req, res) => {
    const { title, maxStudents, maxAttempts, startTime, endTime, questions } = req.body;

    if (!title || !maxStudents || !startTime || !endTime || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const test = new Test({
        title,
        createdBy: req.user._id,
        maxStudents,
        maxAttempts,
        startTime,
        endTime,
        questions
    });

    const createdTest = await test.save();
    res.status(201).json(createdTest);
};

const Registration = require('../models/Registration');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
const getTests = async (req, res) => {
    // If faculty, show only their tests. If student, show all active tests.
    let tests;
    if (req.user.role === 'faculty') {
        tests = await Test.find({ createdBy: req.user._id }).lean();
    } else {
         tests = await Test.find({}).lean(); // Students see all tests
    }

    // Add registration count to each test
    const testsWithStats = await Promise.all(tests.map(async (test) => {
        const registrationCount = await Registration.countDocuments({ test: test._id });
        return { ...test, registrationCount };
    }));
    
    res.json(testsWithStats);
};

// @desc    Get test by ID
// @route   GET /api/tests/:id
// @access  Private
const getTestById = async (req, res) => {
    const test = await Test.findById(req.params.id);

    if (test) {
        res.json(test);
    } else {
        res.status(404).json({ message: 'Test not found' });
    }
};

module.exports = {
    createTest,
    getTests,
    getTestById,
};
