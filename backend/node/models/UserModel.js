const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phoneNumber: Number,
    userType: { type: String, enum: ['Student', 'Mentor', 'Admin'], required: true },
    role: { type: String, enum: ['mentor', 'mentee'], required: false },
    preferredLanguage: {type: String, default: 'English'},
    linkedin: String,
    github: String,
    createdAt: { type: Date, default: Date.now },
    
    // Restoring your original fields
    skills: [{
        name: { type: String, required: true },
        proficiency: { type: Number, min: 0, max: 100, default: 50 }
    }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    careerGoals: [String],
    preferences: {
        location: [String],
        preferredStipendRange: String,
        remotePreference: Boolean
    },
    achievements: [String],
    badges: [String],
    leaderboardRank: Number,

    // Additional Mentor-Mentee Fields (Merged Properly)
    totalScore: { type: Number, default: 0 },

    // Student-Specific Fields
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Mentor reference
    progress: {
        totalHoursLearned: { type: Number, default: 0 },
        lecturesAttended: { type: Number, default: 0 },
        completionRate: { type: Number, default: 0 }
    },
    education: {
        class10: { school: String, percentage: Number, yearOfCompletion: Number },
        class12: { school: String, percentage: Number, yearOfCompletion: Number },
        currentEducation: {
            institution: String,
            course: String,
            specialization: String,
            yearOfStudy: Number,
            cgpa: Number
        }
    },
    extracurricular: [{ activity: String, role: String, description: String, duration: String }],
    internships: [{ company: String, role: String, duration: String, description: String }],
    futureGoals: {
        shortTerm: String,
        longTerm: String,
        dreamCompanies: [String]
    },

    // Mentor-Specific Fields
    rating: { type: Number, default: 0 },
    totalHoursTaught: { type: Number, default: 0 },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    reviews: [{
        mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
