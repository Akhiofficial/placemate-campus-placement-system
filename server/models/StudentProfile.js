const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Personal Details
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    permanentAddress: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String, // e.g., "San Francisco, CA"
        trim: true
    },
    profilePictureUrl: {
        type: String,
        trim: true
    },
    coverImageUrl: {
        type: String,
        trim: true
    },
    isOpenToWork: {
        type: Boolean,
        default: true
    },

    // Academic Information
    university: {
        type: String,
        trim: true
    },
    universityRollNo: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    currentSemester: {
        type: String // e.g., "Semester 6" or just "6"
    },
    cgpa: {
        type: Number,
        min: 0,
        max: 10
    },
    backlogs: {
        type: Number,
        default: 0
    },
    attendance: {
        type: Number, // Percentage 0-100
        min: 0,
        max: 100
    },
    graduationYear: {
        type: Number
    },
    department: {
        type: String,
        trim: true
    },
    major: {
        type: String,
        trim: true
    },

    // Professional & Skills
    resumeUrl: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    },
    portfolioUrl: {
        type: String,
        trim: true
    },
    linkedinUrl: {
        type: String,
        trim: true
    },
    // Experience
    experience: [{
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
    }],
    // Projects
    projects: [{
        title: String,
        description: String,
        link: String,
        technologies: [String],
        startDate: Date,
        endDate: Date
    }],
    // Settings
    notificationPreferences: {
        email: { type: Boolean, default: true },
        browser: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
