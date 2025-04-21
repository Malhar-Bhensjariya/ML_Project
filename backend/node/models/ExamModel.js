const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Changed from 'Mentor' to 'User'
    required: true
  },
  title: { type: String, required: true },
  description: String,
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String
  }],
  assignedStudents: [{ // Changed from 'assignedMentees'
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  scores: [{
    student: { // Changed from 'mentee'
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    totalMarks: Number,
    submittedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
