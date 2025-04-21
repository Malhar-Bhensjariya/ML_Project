const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        unique: true
    },
    notes: {
        courseName: { type: String, required: true },
        skills: [{ type: String }],
        chapters: [{
            chapterName: { type: String, required: true },
            notes: {
                explanation: { type: String, required: true },
                codeExample: { type: String }
            }
        }]
    }
}, { timestamps: true });

module.exports = mongoose.model('Notes', notesSchema);