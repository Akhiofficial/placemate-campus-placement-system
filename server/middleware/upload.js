const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path'); // Still needed for extension check? Cloudinary handles formats but we want strict check.

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname).substring(1).toLowerCase() || 'pdf';
        return {
            folder: 'resumes',
            resource_type: 'raw',
            public_id: `${file.fieldname}-${Date.now()}.${ext}`
        };
    },
});

// Check file type (Client side validation is better, but server side is safe)
function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs and Docs Only!');
    }
}

// Init upload
const uploadResume = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = uploadResume;
