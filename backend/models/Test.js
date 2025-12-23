const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maxStudents: {
        type: Number,
        required: true,
    },
    maxAttempts: {
        type: Number,
        default: 1,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctOption: { type: Number, required: true }, // Index of the correct option
            marks: { type: Number, default: 1 }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Test = mongoose.model('Test', testSchema);
module.exports = Test;
