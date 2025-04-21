const express = require('express');
const router = express.Router();
const Course = require('../models/CourseModel');
const Flashcard = require('../models/FlashcardModel');
const { generateFlashcard } = require('../config/FlashcardAI');

// Generate or get flashcards for a course
router.post('/genflashcards/:courseId', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check for existing flashcards
        const existingFlashcards = await Flashcard.findOne({ course: course._id });
        if (existingFlashcards) {
            return res.status(200).json({
                message: 'Flashcards already exist for this course',
                flashcards: existingFlashcards
            });
        }

        // Generate new flashcards
        const prompt = `Generate the flashcard on topic ${course.courseName} in JSON format with front back content, Maximum 15. Only return the JSON array, no additional text.`;
        const result = await generateFlashcard.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract and parse JSON
        const jsonString = text.match(/```json\n([\s\S]*?)\n```/)?.[1] || text;
        const cardsData = JSON.parse(jsonString);

        // Create new flashcard document
        const newFlashcards = await Flashcard.create({
            course: course._id,
            cards: cardsData
        });

        res.status(201).json({
            message: 'Flashcards generated successfully',
            flashcards: newFlashcards
        });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({
            message: 'Error generating flashcards',
            error: error.message
        });
    }
});

// Get flashcards for a course
router.get('/flashcards/:courseId', async (req, res) => {
    try {
        const flashcards = await Flashcard.findOne({ course: req.params.courseId })
            .populate('course', 'courseName');
        
        if (!flashcards) {
            return res.status(404).json({
                message: 'No flashcards found for this course',
                actionRequired: true
            });
        }

        res.json({
            message: 'Flashcards retrieved successfully',
            flashcards
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching flashcards',
            error: error.message
        });
    }
});

module.exports = router;