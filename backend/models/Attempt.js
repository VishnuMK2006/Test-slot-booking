const mongoose = require('mongoose');

const attemptSchema = mongoose.Schema({
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
    score: {
        type: Number,
        default: 0,
    },
    answers: [
        {
            questionId: mongoose.Schema.Types.ObjectId,
            selectedOption: Number
        }
    ],
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    }
}, {
    timestamps: true,
});

const Attempt = mongoose.model('Attempt', attemptSchema);
module.exports = Attempt;
