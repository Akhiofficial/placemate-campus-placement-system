const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId, // Optional, sometimes general interview
        ref: 'Job'
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String, // e.g., "Junior Developer"
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // e.g., "10:00 AM"
        required: true
    },
    duration: {
        type: String, // e.g., "45 mins"
        default: "30 mins"
    },
    type: {
        type: String,
        enum: ['Virtual', 'In-person', 'Phone'],
        default: 'Virtual'
    },
    round: {
        type: String, // e.g., "HR Round", "Technical Round"
    },
    platform: {
        type: String, // "Zoom", "Google Meet", "Custom Video"
        default: "Custom Video"
    },
    meetingLink: {
        type: String, // URL or Room ID
    },
    location: {
        type: String // Physical location for in-person
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Confirmed', 'Pending', 'Completed', 'Cancelled', 'Rescheduled'],
        default: 'Pending'
    },
    feedback: {
        type: String,
        trim: true
    },
    feedbackStatus: {
        type: String,
        enum: ['Pending', 'Submitted'],
        default: 'Pending'
    },
    logo: {
        type: String // Company logo url for UI
    }
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
