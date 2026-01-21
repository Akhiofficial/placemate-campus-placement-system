const Interview = require('../models/Interview');

// @desc    Get my interviews
// @route   GET /api/interviews
// @access  Private (Student)
exports.getMyInterviews = async (req, res) => {
    try {
        const studentId = req.user.userId;
        const { status, search } = req.query;

        let query = { student: studentId };

        if (status) {
            if (status === 'Upcoming') {
                query.status = { $in: ['Scheduled', 'Rescheduled', 'Confirmed'] };
            } else {
                query.status = status;
            }
        }

        if (search) {
            query.$or = [
                { company: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } }
            ];
        }

        const interviews = await Interview.find(query).sort({ date: 1 }); // Ascending date (nearest first)

        // Count for stats
        const upcomingCount = await Interview.countDocuments({
            student: studentId,
            status: { $in: ['Scheduled', 'Rescheduled', 'Confirmed'] }
        });

        res.json({
            interviews,
            stats: {
                upcoming: upcomingCount
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ msg: 'Interview not found' });
        }
        res.json(interview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Reschedule Interview
// @route   POST /api/interviews/:id/reschedule
// @access  Private (Student)
exports.rescheduleInterview = async (req, res) => {
    try {
        const { date, time, reason } = req.body;
        let interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ msg: 'Interview not found' });
        }

        // Verify ownership
        if (interview.student.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update fields
        interview.date = date;
        interview.time = time;
        interview.status = 'Rescheduled';
        // In a real app, we might save 'reason' to a log or notes field

        await interview.save();
        res.json({ msg: 'Interview rescheduled successfully', interview });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Generate ICS Calendar File
// @route   GET /api/interviews/sync/ics
// @access  Private (Student)
exports.syncCalendar = async (req, res) => {
    try {
        const interviews = await Interview.find({
            student: req.user.userId,
            status: { $in: ['Scheduled', 'Rescheduled'] }
        });

        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PlaceMate//Calendar//EN\n";

        interviews.forEach(interview => {
            // Format date for ICS (YYYYMMDDTHHMMSSZ) roughly or just YYYYMMDD
            // This is a basic implementation. Real ICS needs proper UTC formatting.
            const dateObj = new Date(interview.date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const dateStr = `${year}${month}${day}`;

            icsContent += "BEGIN:VEVENT\n";
            icsContent += `SUMMARY:Interview with ${interview.company} (${interview.role})\n`;
            icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`; // All day for simplicity MVP or parse time if needed
            icsContent += `DESCRIPTION:Round: ${interview.round || 'General'}\\nLink: ${interview.meetingLink || 'N/A'}\n`;
            icsContent += `LOCATION:${interview.platform}\n`;
            icsContent += "END:VEVENT\n";
        });

        icsContent += "END:VCALENDAR";

        res.setHeader('Content-Type', 'text/calendar');
        res.setHeader('Content-Disposition', 'attachment; filename=interviews.ics');
        res.send(icsContent);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
