const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
    jsonMockResp: { type: String, required: true },
    jobPosition: { type: String, required: true },
    jobDesc: { type: String, required: true },
    jobExperience: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);