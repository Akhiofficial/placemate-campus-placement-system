const Notification = require('../models/Notification');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.userId,
            read: false
        });

        res.json({
            notifications,
            unreadCount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        // Verify ownership
        if (notification.recipient.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.userId, read: false },
            { $set: { read: true } }
        );
        res.json({ msg: 'All notifications marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
    try {
        const { email, browser, sms } = req.body;

        let profile = await StudentProfile.findOne({ user: req.user.userId });
        if (!profile) {
            return res.status(404).json({ msg: 'Student profile not found' });
        }

        if (email !== undefined) profile.notificationPreferences.email = email;
        if (browser !== undefined) profile.notificationPreferences.browser = browser;
        if (sms !== undefined) profile.notificationPreferences.sms = sms;

        await profile.save();
        res.json(profile.notificationPreferences);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
