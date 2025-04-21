const mongoose = require('mongoose');
const Team = require('../models/TeamModel');
const Lecture = require('../models/Lecture');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const User = require('../models/UserModel');

// Create Team
exports.createTeam = async (req, res) => {
    try {
        const { mentorId, menteeIds, teamname } = req.body;

        // Validate that all required fields are provided
        if (!mentorId || !menteeIds || !Array.isArray(menteeIds) || menteeIds.length === 0) {
            return res.status(400).json({ message: 'Mentor ID and at least one Mentee ID are required.' });
        }

        // Check if the mentor exists
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found.' });
        }

        // Check if all mentees exist
        const mentees = await Mentee.find({ '_id': { $in: menteeIds } });
        if (mentees.length !== menteeIds.length) {
            return res.status(404).json({ message: 'One or more Mentees not found.' });
        }

        // Create the team
        const team = new Team({
            teamname: teamname,
            mentor: mentorId,
            mentee: menteeIds
        });

        // Save the team
        await team.save();

        // Return the created team
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//GET Team details based on user id
exports.getTeams = async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let teams = [];
        let response = [];

        if (user.role === 'mentor') {
            const mentor = await Mentor.findOne({ user: userId });
            if (mentor) {
                teams = await Team.find({ mentor: mentor._id }).populate('mentor').populate('mentee').populate('lectures');
                response = teams.map(team => ({
                    teamId: team._id,
                    teamDetails: team,
                    mentorId: mentor._id
                }));
            }
        } else if (user.role === 'mentee') {
            const mentee = await Mentee.findOne({ user: userId });
            if (mentee) {
                teams = await Team.find({ mentee: mentee._id }).populate('mentor').populate('mentee').populate('lectures');
                response = teams.map(team => ({
                    teamId: team._id,
                    teamDetails: team,
                    menteeId: mentee._id
                }));
            }
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get all teams with latest lectures
exports.getTeamWithLatestLecture = async (req, res) => {
    const { teamId } = req.query;

    try {
        // Find the team by ID
        const team = await Team.findById(teamId)
            .populate('mentor')
            .populate('mentee')
            .populate('lectures');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Find the latest lecture from the team's lectures array
        const latestLecture = await Lecture.findOne({ _id: { $in: team.lectures } })
            .sort({ startTime: -1 }) // Get the latest lecture by start time
            .limit(1);

        // Return the team details + latest lecture
        res.status(200).json({
            teamId: team._id,
            teamDetails: team,
            latestLecture: latestLecture || null
        });

    } catch (error) {
        console.error('Error fetching team lectures:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};



