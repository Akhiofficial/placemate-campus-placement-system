const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
    academicYear: {
        type: String,
        default: '2025-2026'
    },
    placementSeasonStart: {
        type: Date,
        default: new Date('2025-06-01')
    },
    placementSeasonEnd: {
        type: Date,
        default: new Date('2026-05-31')
    },
    openRegistration: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
