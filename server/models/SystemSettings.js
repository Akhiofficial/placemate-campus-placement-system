const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
    academicYear: {
        type: String,
        default: '2025-2026'
    },
    academicYears: {
        type: [String],
        default: ['2023 - 2024', '2024 - 2025', '2025 - 2026', '2026 - 2027']
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
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
