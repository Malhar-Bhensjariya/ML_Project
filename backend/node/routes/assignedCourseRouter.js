const express = require('express');
const router = express.Router();
const assignedCourseController = require('../controllers/assignedCourseController');

router.post('/', assignedCourseController.createAssignedCourse);  // Create assigned course
router.get('/', assignedCourseController.getAllAssignedCourses);  // List all
router.get('/by-org-course/:orgCourseId', assignedCourseController.getAssignedCourseByOrgCourse);
router.get('/assigned-courses/:menteeId', assignedCourseController.getAssignedCoursesForUser);
router.get('/:id', assignedCourseController.getAssignedCourseById);  // Get single by ID
router.put('/:assignedCourseId/addMentee', assignedCourseController.addUserToAssignedCourse);  // Add mentee to course
router.delete('/:id', assignedCourseController.deleteAssignedCourse);  // Delete assigned course
router.get('/mentor/:mentor', assignedCourseController.getCoursesByMentor);  // Courses assigned by specific mentor
router.put('/:assignedCourseId/setDueDate', assignedCourseController.setDueDate);

module.exports = router;
