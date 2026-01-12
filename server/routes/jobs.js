const express = require('express');
const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes protected
router.use(protect);

// Public/Student routes (or strict? existing ones seem open to all auth users)
router.get('/', getAllJobs);
router.get('/my-jobs', authorize('company'), getMyJobs); // User specific
router.get('/:id', getJobById);

// Company routes
router.post('/', authorize('company'), createJob);
router.put('/:id', authorize('company'), updateJob);
router.delete('/:id', authorize('company'), deleteJob);

module.exports = router;
