const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/authRouter');
const courseRoutes = require('./routes/courseRouter');
const assessmentRoutes = require('./routes/assessmentRouter');
const generateCourseRoutes = require('./routes/generateCourseRouter');
const generateChapterContentRoutes = require('./routes/generateChapterContentRouter');
const generateCourseNotesRoutes = require('./routes/generateCourseNotesRouter');
const interviewRoutes = require('./routes/interviewRouter');
const menteeProfileRouter = require('./routes/menteeProfileRouter');
const assignedCourseRouter = require('./routes/assignedCourseRouter');
const chatbotRouter = require('./routes/chatbotRouter');
const flashcardRouter = require('./routes/flashcardRouter');
const gamificationRouter = require('./routes/GamificationRouter');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: [
    'https://athena-ai-ten.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api', generateCourseRoutes);
app.use('/api', generateChapterContentRoutes);
app.use('/api/notes', generateCourseNotesRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api', gamificationRouter);
app.use('/api/mentee', menteeProfileRouter);
app.use('/api/assigned', assignedCourseRouter);
app.use('/api', chatbotRouter);
app.use('/api', flashcardRouter);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
