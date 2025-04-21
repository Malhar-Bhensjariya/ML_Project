const mongoose = require("mongoose");
const assessmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    questions: { type: Array, required: true }, 
    score: { type: Number, default: 0 },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } ,
    createdAt: { type: Date, default: Date.now }
  });
  
module.exports = mongoose.model("Assessment", assessmentSchema);