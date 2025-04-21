const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamname: {
        type: String,
        required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    mentee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentee'
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    }]
}, { timestamps: true });

const Team = mongoose.model('Team', TeamSchema);
module.exports = Team;
