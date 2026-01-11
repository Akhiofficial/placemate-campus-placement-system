const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String, // For MVP, simple text. Can be ref to a Company profile later.
        required: true,
        trim: true
    },
    companyLogo: {
        type: String, // URL to image
        default: ''
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Internship', 'Contract', 'Freelance'],
        default: 'Full-time'
    },
    workMode: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        default: 'On-site'
    },
    salary: {
        type: String, // Display string e.g. "12-15 LPA"
        trim: true
    },
    salaryMin: {
        type: Number, // For filtering
        default: 0
    },
    salaryMax: {
        type: Number, // For filtering
        default: 0
    },
    requirements: {
        type: [String], // Array of requirement strings
        default: []
    },
    eligibility: {
        type: String, // e.g. "B.Tech (CSE) / MCA"
        trim: true
    },
    tags: {
        type: [String], // e.g. ["New", "Design", "Urgent"]
        default: []
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    deadline: {
        type: Date
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin or Company user who posted it
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
