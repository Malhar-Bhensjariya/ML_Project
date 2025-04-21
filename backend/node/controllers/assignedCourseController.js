const AssignedCourse = require('../models/AssignedCourseModel');
const Course = require('../models/CourseModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');

// Create Assigned Course
const createAssignedCourse = async (req, res) => {
    try {
        const { mentor, assigns, orgCourseId, dueDate } = req.body;

        const assignedCourse = new AssignedCourse({
            mentor,
            assigns,
            orgCourseId,
            dueDate
        });

        await assignedCourse.save();
        res.status(201).json({ message: 'Assigned Course created successfully', assignedCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error creating assigned course', error });
    }
};

// Get All Assigned Courses
const getAllAssignedCourses = async (req, res) => {
    try {
        const assignedCourses = await AssignedCourse.find().populate('assigns.userId assigns.courseCopy orgCourseId');
        res.json(assignedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned courses', error });
    }
};

// Get Assigned Course by ID
const getAssignedCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const assignedCourse = await AssignedCourse.findById(id).populate('assigns.userId assigns.courseCopy orgCourseId');
        if (!assignedCourse) return res.status(404).json({ message: 'Assigned Course not found' });
        res.json(assignedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned course', error });
    }
};

// Add User Assignment (Replacing mentee references)
const addUserToAssignedCourse = async (req, res) => {
    try {
        const { assignedCourseId } = req.params;
        const { userId, orgCourseId } = req.body;

        const originalCourse = await Course.findById(orgCourseId);
        if (!originalCourse) return res.status(404).json({ message: 'Original Course not found' });

        const duplicatedCourse = new Course(originalCourse.toObject());
        duplicatedCourse._id = new mongoose.Types.ObjectId();
        duplicatedCourse.isNew = true;
        await duplicatedCourse.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { courses: duplicatedCourse._id } },
            { new: true }
        );

        const updatedAssignedCourse = await AssignedCourse.findByIdAndUpdate(
            assignedCourseId,
            { $push: { assigns: { userId, courseCopy: duplicatedCourse._id } } },
            { new: true }
        ).populate('assigns.userId assigns.courseCopy orgCourseId');

        res.json({ message: 'User added with new course copy', updatedAssignedCourse });

    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
};

// Get Assigned Course by Original Course ID
const getAssignedCourseByOrgCourse = async (req, res) => {
    try {
        const { orgCourseId } = req.params;
        const assignedCourse = await AssignedCourse.findOne({ orgCourseId });

        if (!assignedCourse) {
            return res.status(404).json({ message: 'Assigned Course not found' });
        }

        res.json({ assignedCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned course', error });
    }
};

// Get Assigned Courses for a User
const getAssignedCoursesForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const assignedCourses = await AssignedCourse.find({
            'assigns.userId': userId
        }).populate('assigns.courseCopy');

        const filteredCourses = assignedCourses.flatMap(assignedCourse =>
            assignedCourse.assigns
                .filter(assign => assign.userId.toString() === userId)
                .map(assign => ({
                    _id: assign.courseCopy._id,
                    courseName: assign.courseCopy.courseName,
                    description: assign.courseCopy.description,
                    skills: assign.courseCopy.skills,
                    level: assign.courseCopy.level,
                    passedFinal: assign.courseCopy.passedFinal,
                    assignedDate: assignedCourse.updatedAt,
                    mentor: assignedCourse.mentor
                }))
        );

        res.status(200).json({ courses: filteredCourses });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assigned courses.' });
    }
};

// Set due date
const setDueDate = async (req, res) => {
    try {
        const { dueDate } = req.body;
        const assignedCourse = await AssignedCourse.findByIdAndUpdate(
            req.params.assignedCourseId,
            { dueDate },
            { new: true }
        );
        res.json({ message: 'Due date set', assignedCourse });
    } catch (error) {
        res.status(500).json({ error: 'Failed to set due date' });
    }
};

// Delete Assigned Course
const deleteAssignedCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await AssignedCourse.findByIdAndDelete(id);
        res.json({ message: 'Assigned Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assigned course', error });
    }
};

// List Assigned Courses for Specific Mentor
const getCoursesByMentor = async (req, res) => {
    try {
        const { mentor } = req.params;
        const assignedCourses = await AssignedCourse.find({ mentor }).populate('assigns.userId assigns.courseCopy orgCourseId');
        res.json(assignedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mentor courses', error });
    }
};

module.exports = {
    createAssignedCourse,
    getAllAssignedCourses,
    getAssignedCourseById,
    addUserToAssignedCourse, // Updated function name
    deleteAssignedCourse,
    getCoursesByMentor,
    getAssignedCourseByOrgCourse,
    getAssignedCoursesForUser, // Updated function name
    setDueDate
};
