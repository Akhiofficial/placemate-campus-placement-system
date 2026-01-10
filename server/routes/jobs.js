const express = require('express');
const { getAllJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes protected
router.use(protect);

router.get('/', getAllJobs);
router.get('/:id', getJobById);

module.exports = router;
