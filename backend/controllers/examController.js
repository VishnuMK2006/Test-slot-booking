const Test = require('../models/Test');
const Registration = require('../models/Registration');
const Attempt = require('../models/Attempt');

// @desc    Register for a test
// @route   POST /api/exam/register/:testId
// @access  Private (Student)
const registerForTest = async (req, res) => {
    const { testId } = req.params;
    const studentId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) {
        return res.status(404).json({ message: 'Test not found' });
    }

    // 1. Check Time Window
    const now = new Date();
    if (now > test.endTime) {
        return res.status(400).json({ message: 'Test registration is closed (Time over)' });
    }
    // Note: Allowing registration before start time is fine, but maybe block attempting.

    // 2. Check Double Registration
    const existingRegistration = await Registration.findOne({ test: testId, student: studentId });
    if (existingRegistration) {
        return res.status(400).json({ message: 'Already registered for this test' });
    }

    // 3. Check Max Students (FCFS)
    const registrationCount = await Registration.countDocuments({ test: testId });
    if (registrationCount >= test.maxStudents) {
        return res.status(400).json({ message: 'Test is full (Max students reached)' });
    }

    const registration = await Registration.create({
        test: testId,
        student: studentId
    });

    res.status(201).json(registration);
};

// @desc    Start an attempt
// @route   POST /api/exam/attempt/:testId
// @access  Private (Student)
const startAttempt = async (req, res) => {
    const { testId } = req.params;
    const studentId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) {
        return res.status(404).json({ message: 'Test not found' });
    }

    // Check availability
    const now = new Date();
    if (now < test.startTime || now > test.endTime) {
        return res.status(400).json({ message: 'Test is not currently active' });
    }

    // Check registration
    const isRegistered = await Registration.findOne({ test: testId, student: studentId });
    if (!isRegistered) {
        return res.status(403).json({ message: 'Not registered for this test' });
    }

    // Check max attempts
    const attempts = await Attempt.countDocuments({ test: testId, student: studentId });
    if (attempts >= test.maxAttempts) {
        return res.status(400).json({ message: 'Maximum attempts reached' });
    }

    // Check for incomplete attempts (resuming)
    const incompleteAttempt = await Attempt.findOne({ 
        test: testId, 
        student: studentId, 
        status: 'in-progress' 
    });

    if (incompleteAttempt) {
        return res.json(incompleteAttempt);
    }

    // Start new attempt
    const attempt = await Attempt.create({
        test: testId,
        student: studentId,
        startTime:  new Date()
    });

    res.status(201).json(attempt);
};

// @desc    Submit an attempt
// @route   POST /api/exam/submit/:attemptId
// @access  Private (Student)
const submitAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body; // [{ questionId, selectedOption }]

    const attempt = await Attempt.findById(attemptId).populate('test');
    if (!attempt) {
        return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.status === 'completed') {
        return res.status(400).json({ message: 'Test already submitted' });
    }
    
    // Validate submission time vs test end time (giving a small buffer maybe?)
    const now = new Date();
    // Strict check: if (now > attempt.test.endTime) ... (can accept late submissions if network issues? adhering to strict for now)
    
    let score = 0;
    const testQuestions = attempt.test.questions;

    // Calculate score
    const processedAnswers = [];
    if (answers && answers.length > 0) {
        answers.forEach(ans => {
            const question = testQuestions.find(q => q._id.toString() === ans.questionId);
            if (question) {
                if (question.correctOption === ans.selectedOption) {
                    score += question.marks;
                }
                processedAnswers.push({
                    questionId: ans.questionId,
                    selectedOption: ans.selectedOption
                });
            }
        });
    }

    attempt.answers = processedAnswers;
    attempt.score = score;
    attempt.status = 'completed';
    attempt.endTime = now;
    
    await attempt.save();

    res.json(attempt);
};

// @desc    Get student's registrations
// @route   GET /api/exam/registrations
// @access  Private
const getMyRegistrations = async (req, res) => {
    const registrations = await Registration.find({ student: req.user._id }).populate('test');
    res.json(registrations);
};

// @desc    Get student's attempts
// @route   GET /api/exam/attempts
// @access  Private
const getMyAttempts = async (req, res) => {
    const attempts = await Attempt.find({ student: req.user._id }).populate('test');
    res.json(attempts);
};

module.exports = {
    registerForTest,
    startAttempt,
    submitAttempt,
    getMyRegistrations,
    getMyAttempts
};
