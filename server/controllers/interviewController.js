const Interview = require('../models/Interview');

// @desc    Get my interviews
// @route   GET /api/interviews
// @access  Private (Student)
// @desc    Get my interviews
// @route   GET /api/interviews
// @access  Private (Student)
exports.getMyInterviews = async (req, res) => {
    try {
        const studentId = req.user.userId;
        const { status, search } = req.query;

        // Auto-update past interviews to 'Completed'
        const now = new Date();
        // Set to beginning of today? user said "past date", usually means date < now. 
        // If we want checking time, it's harder with just date stored. Assuming date stored is start of day or simplified.
        // Let's assume if date < today (start of today), it's completed. 
        // If date is today, we check time? User's prompt implies "past date buttons are enabled", so maybe date-based.
        // Safest is: if date < now (and maybe buffer for end of day).
        // Let's simple check: If date < yesterday's end, mark completed.
        // Actually, let's just use strict Date comparison.

        await Interview.updateMany(
            {
                student: studentId,
                status: { $in: ['Scheduled', 'Rescheduled', 'Confirmed'] },
                date: { $lt: now }
            },
            { $set: { status: 'Completed' } }
        );

        let query = { student: studentId };

        if (status) {
            if (status === 'Upcoming') {
                query.status = { $in: ['Scheduled', 'Rescheduled', 'Confirmed'] };
                // Also ensure we only show future ones if auto-update didn't catch slightly future ones (e.g. today but later) - though auto-update covers < now
                query.date = { $gte: now };
            } else {
                query.status = status;
            }
        }

        // If fetching 'Completed', we want those we just updated too
        if (status === 'Completed') {
            // no extra filter needed, matched by status update above
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
            status: { $in: ['Scheduled', 'Rescheduled', 'Confirmed'] },
            date: { $gte: now }
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
            status: { $in: ['Scheduled', 'Rescheduled', 'Confirmed'] }
        });

        // RFC 5545 requires CRLF line endings
        const CRLF = '\r\n';

        let icsContent = `BEGIN:VCALENDAR${CRLF}`;
        icsContent += `VERSION:2.0${CRLF}`;
        icsContent += `PRODID:-//PlaceMate//Campus Placement System//EN${CRLF}`;
        icsContent += `CALSCALE:GREGORIAN${CRLF}`;
        icsContent += `METHOD:PUBLISH${CRLF}`;

        interviews.forEach(interview => {
            const dateObj = new Date(interview.date);
            // Parse time string "10:30 AM" or "14:00"
            let hours = 9;
            let minutes = 0;

            if (interview.time) {
                const timeParts = interview.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                if (timeParts) {
                    let h = parseInt(timeParts[1]);
                    let m = parseInt(timeParts[2]);
                    let ampm = timeParts[3];

                    if (ampm) {
                        if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
                        if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
                    }
                    hours = h;
                    minutes = m;
                }
            }

            dateObj.setHours(hours, minutes, 0, 0);

            // Format to ICS string YYYYMMDDTHHMMSS
            const formatICSDate = (date) => {
                return date.getFullYear() +
                    String(date.getMonth() + 1).padStart(2, '0') +
                    String(date.getDate()).padStart(2, '0') +
                    'T' +
                    String(date.getHours()).padStart(2, '0') +
                    String(date.getMinutes()).padStart(2, '0') +
                    '00';
            };

            const startStr = formatICSDate(dateObj);
            const endDateObj = new Date(dateObj.getTime() + 60 * 60 * 1000); // 1 hour duration
            const endStr = formatICSDate(endDateObj);
            const nowStr = formatICSDate(new Date()) + 'Z'; // DTSTAMP needs Z (UTC) usually, but floating is safer for local testing without timezone logic

            // Generate a simpler unique ID
            const uid = `${interview._id}@placemate.com`;

            icsContent += `BEGIN:VEVENT${CRLF}`;
            icsContent += `UID:${uid}${CRLF}`;
            icsContent += `DTSTAMP:${nowStr}${CRLF}`;
            icsContent += `DTSTART:${startStr}${CRLF}`;
            icsContent += `DTEND:${endStr}${CRLF}`;
            icsContent += `SUMMARY:Interview: ${interview.company}${CRLF}`;
            icsContent += `DESCRIPTION:Role: ${interview.role}\\nRound: ${interview.round || 'General'}\\nLink: ${interview.meetingLink || 'N/A'}${CRLF}`;
            icsContent += `LOCATION:${interview.platform || 'Virtual'}${CRLF}`;
            icsContent += `STATUS:CONFIRMED${CRLF}`;
            icsContent += `END:VEVENT${CRLF}`;
        });

        icsContent += `END:VCALENDAR${CRLF}`;

        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=interviews.ics');
        res.send(icsContent);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
