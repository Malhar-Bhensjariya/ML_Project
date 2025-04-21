const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    skill: { type: String },
    difficulty_levels: {
        Easy: [{
            wave: { type: Number, required: true },
            questions: [{
                question: { type: String, required: true },
                options: { type: [String], required: true },
                correct_answer: { type: String, required: true }
            }],
            stars_earned: { 
                type: Number, 
                min: 0,
                max: 3,
                default: 0 
            },
            star_type: { type: String, default: 'bronze' }
        }],
        Medium: [{
            wave: { type: Number, required: true },
            questions: [/* same structure */],
            stars_earned: { 
                type: Number, 
                min: 0,
                max: 3,
                default: 0 
            },
            star_type: { type: String, default: 'silver' }
        }],
        Hard: [{
            wave: { type: Number, required: true },
            questions: [/* same structure */],
            stars_earned: { 
                type: Number, 
                min: 0,
                max: 3,
                default: 0 
            },
            star_type: { type: String, default: 'gold' }
        }]
    },
    progress: {
        waves_cleared: {
            Easy: { type: Number, default: 0 },
            Medium: { type: Number, default: 0 },
            Hard: { type: Number, default: 0 }
        },
        star_counts: {
            bronze: { type: Number, default: 0 },
            silver: { type: Number, default: 0 },
            gold: { type: Number, default: 0 }
        },
        total_stars: { type: Number, default: 0, max: 27 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);