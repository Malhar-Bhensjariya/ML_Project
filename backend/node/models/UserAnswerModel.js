const mongoose = require('mongoose');
const userAnswerSchema = new mongoose.Schema({
    mockIdRef: { type: mongoose.Schema.Types.ObjectId, ref: 'MockInterview', required: true }, // Reference to MockInterview
    question: { type: String, required: true },
    correctAns: { type: String },
    userAns: { type: String },
    feedback: { type: String },
    rating: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('UserAnswer', userAnswerSchema);