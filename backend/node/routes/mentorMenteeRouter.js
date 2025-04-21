const express = require('express');
const router = express.Router();
const mentorMenteeController = require('../controllers/mentorMenteeController');
const User = require("../models/UserModel");
const auth = require('../middleware/authMiddleware');

// Mentor routes
router.get('/mentor/mentees', auth, mentorMenteeController.getMentorMentees);
router.get('/mentor/:mentorId', auth, mentorMenteeController.getMentorDetails);

// Mentee routes
router.get('/mentee/mentor', auth, mentorMenteeController.getMenteeMentor);
router.get('/mentee/:menteeId', auth, mentorMenteeController.getMenteeDetails);

// Get all mentees assigned to a mentor
router.get("/mentees/:userId", auth, async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the mentor by user ID
        const mentor = await User.findOne({ _id: userId, userType: 'Mentor' }).populate("mentees", "name email");

        if (!mentor) {
            return res.status(404).json({ error: "Mentor not found or no assigned mentees" });
        }

        res.json({ mentees: mentor.mentees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
