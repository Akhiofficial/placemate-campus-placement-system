const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        maxlength: 2000,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    location: { // E.g. "San Francisco, CA" (Header)
        type: String,
        trim: true
    },
    headquarters: { // E.g. "San Francisco, CA" (Details)
        type: String,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    companySize: {
        type: String, // e.g. "1,000 - 5,000 employees"
        trim: true
    },
    foundedYear: {
        type: Number
    },
    socialLinks: {
        linkedin: { type: String, trim: true },
        twitter: { type: String, trim: true },
        instagram: { type: String, trim: true },
        facebook: { type: String, trim: true }
    },
    values: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String } // Can be lucide-react icon name or url
    }],
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, { timestamps: true });

// Calculate profile completion before saving
CompanyProfileSchema.pre('save', function (next) {
    let filledFields = 0;
    const totalFields = 10; // Key fields to track

    if (this.companyName) filledFields++;
    if (this.logo) filledFields++;
    if (this.description) filledFields++;
    if (this.industry) filledFields++;
    if (this.companySize) filledFields++;
    if (this.foundedYear) filledFields++;
    if (this.location || this.headquarters) filledFields++;
    if (this.website) filledFields++;
    if (this.socialLinks && (this.socialLinks.linkedin || this.socialLinks.twitter)) filledFields++;
    if (this.values && this.values.length > 0) filledFields++;

    this.profileCompletion = Math.round((filledFields / totalFields) * 100);
    next();
});

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);
