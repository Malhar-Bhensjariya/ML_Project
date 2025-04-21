const express = require('express');
const router = express.Router();
const { generateCourseNotes } = require('../controllers/generateCourseNotes');
const Notes = require('../models/NotesModel');

// Combined generate and save endpoint
router.post('/generate/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseName, description, skills, level, chapters } = req.body;

    // Validate input types
    if (typeof courseName !== 'string' ||
      typeof description !== 'string' ||
      !Array.isArray(skills) ||
      typeof level !== 'string' ||
      !Array.isArray(chapters)) {
      return res.status(400).json({ error: "Invalid input data types" });
    }

    const generatedNotes = await generateCourseNotes({
      courseName,
      description,
      skills,
      level,
      chapterNames: chapters
    });

    const savedNotes = await Notes.findOneAndUpdate(
      { course: courseId },
      {
        course: courseId,
        notes: generatedNotes
      },
      { new: true, upsert: true }
    );

    res.json(savedNotes.notes);
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({
      error: "Note generation failed",
      details: error.message,
      // Only include stack in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// Get notes endpoint
router.get('/:courseId', async (req, res) => {
  try {
    const notes = await Notes.findOne({ course: req.params.courseId });
    if (!notes) return res.status(404).json({ error: "Notes not found" });
    res.json(notes.notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

module.exports = router;