const User = require('../models/UserModel');

// Mentor Controllers
exports.getMentorMentees = async (req, res) => {
    try {
        const mentor = await User.findOne({ _id: req.user.id, userType: 'Mentor' })
            .populate('mentees', 'name email userType progress');

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json(mentor.mentees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMentorDetails = async (req, res) => {
    try {
        const mentor = await User.findOne({ _id: req.params.mentorId, userType: 'Mentor' })
            .select('name email userType rating totalHoursTaught availability reviews');

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json(mentor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mentee Controllers
exports.getMenteeMentor = async (req, res) => {
    try {
        const mentee = await User.findOne({ _id: req.user.id, userType: 'Student' })
            .populate({
                path: 'mentor',
                select: 'name email userType rating totalHoursTaught availability'
            });

        if (!mentee || !mentee.mentor) {
            return res.status(404).json({ message: 'Mentor not found for this mentee' });
        }

        res.json(mentee.mentor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMenteeDetails = async (req, res) => {
    try {
        const mentee = await User.findOne({ _id: req.params.menteeId, userType: 'Student' })
            .select('name email userType progress education futureGoals')
            .populate({
                path: 'mentor',
                select: 'name email userType'
            });

        if (!mentee) {
            return res.status(404).json({ message: 'Mentee not found' });
        }

        res.json(mentee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
