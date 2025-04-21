const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    codeExample: { type: String }
});

const chapterSchema = new mongoose.Schema({
    chapterName: { type: String, required: true },
    about: { type: String, required: true },
    duration: { type: String, required: true },
    sections: [sectionSchema],
    video: {
        url: { type: String },
        thumbnail: { type: String }
    },
    ppt : {
        title: { type: String },
        link: { type: String },
    },
    isCompleted: { type: Boolean, default: false }
});

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    level: { type: String, required: true, enum: ['Basic', 'Intermediate', 'Advanced'] },
    courseOutcomes: { type: [String] },
    duration: { type: String, required: true },
    noOfChapters: { type: Number, required: true },
    chapters: {
        type: [chapterSchema],
        validate: {
            validator: function (chapters) {
                return chapters.length <= 5;
            },
            message: 'A course can have a maximum of 5 chapters only.'
        }
    },
    video: { type: Boolean, default: true },
    certificate: { type: String },
    passedFinal: { type: Boolean, default: false },
    assignedCopy: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
