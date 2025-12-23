const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, mobile, barcode } = req.body;

    // Validation
    if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Check if mobile or barcode exists if provided
    if (barcode) {
        const barcodeExists = await User.findOne({ barcode });
        if (barcodeExists) {
            return res.status(400).json({ message: 'Barcode already registered' });
        }
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student', // default to student
        mobile,
        barcode: barcode || null
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Authenticate user via Barcode
// @route   POST /api/auth/login-barcode
// @access  Public
const loginWithBarcode = async (req, res) => {
    const { barcode } = req.body;

    if (!barcode) {
        return res.status(400).json({ message: 'Barcode is required' });
    }

    const user = await User.findOne({ barcode });

    if (user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid barcode' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getMe = async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    }
    res.status(200).json(user)
}

module.exports = {
    registerUser,
    loginUser,
    loginWithBarcode,
    getMe,
};
