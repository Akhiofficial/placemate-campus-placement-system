const express = require('express');
const { getMyNotifications, markAsRead, markAllAsRead, updatePreferences } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes protected

router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.put('/preferences', updatePreferences);

module.exports = router;
