const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    tagline: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    about: {
        type: String
    },
    industry: {
        type: String
    },
    size: {
        type: String
    },
    founded: {
        type: String
    },
    headquarters: {
        type: String
    },
    logo: {
        type: String
    },
    coverImage: {
        type: String
    },
    social: {
        linkedin: String,
        twitter: String,
        website: String
    },
    values: [{
        title: String,
        description: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);
