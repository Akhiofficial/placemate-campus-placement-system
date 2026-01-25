const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicationId: {
        type: String, // e.g., "APP-1234"
        unique: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Pending', 'In Review', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'],
        default: 'Applied'
    },
    aiScore: {
        type: Number,
        min: 0,
        max: 100
    },
    notes: {
        type: String,
        trim: true
    },
    interviewDate: {
        type: Date
    }
}, { timestamps: true });

// Prevent duplicate applications for the same job by the same student
ApplicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
