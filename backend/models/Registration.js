const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

// Ensure a student can only register once for a specific test
registrationSchema.index({ student: 1, test: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
