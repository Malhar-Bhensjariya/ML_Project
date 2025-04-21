const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true // Ensures one flashcard document per course
    },
    cards: {
        type: [{
            front: { type: String, required: true },
            back: { type: String, required: true }
        }],
        required: true,
        validate: {
            validator: function(cards) {
                return cards.length <= 15;
            },
            message: 'Maximum 15 flashcards allowed per course'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);