// server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    companyName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'company', 'admin', 'superadmin'],
        default: 'student',
    },
    jobTitle: {
        type: String,
        trim: true,
    },
    notificationPreferences: {
        newApplicant: { type: Boolean, default: true },
        interviewReminders: { type: Boolean, default: true },
        jobStatus: { type: Boolean, default: true }
    },
    isApproved: {
        type: Boolean,
        default: function () {
            // Auto-approve student and company, require approval for admin
            return this.role !== 'admin';
        },
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedAt: {
        type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// Pre-save hook to hash password
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
