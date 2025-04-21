const Game = require('../models/Game');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

// Configuration Constants
const SAFETY_SETTINGS = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }
];

const GENERATION_CONFIG = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

// AI Service Initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",  // Updated to latest model
    generationConfig: GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS
});

// Create AI-Generated Game
exports.createGame = async (req, res) => {
    try {
        const { topic, skill, userId } = req.body;

        const prompt = `Generate 27 MCQs for a tower-climbing game about ${topic} with this EXACT JSON structure:
        {
            "name": "${topic} Mastery",
            "difficulty_levels": {
                "Easy": [{
                    "wave": 1,
                    "questions": [{
                        "question": "...", 
                        "options": ["A","B","C","D"],
                        "correct_answer": "A"
                    }],
                    "star_type": "bronze"
                }],
                "Medium": [...],
                "Hard": [...]
            }
        }

        Content Guidelines:
        1. Tower Climbing Theme:
        - Frame questions as challenges in a tower
        - Use climbing/level-up metaphors in questions
        - Imagine each wave as a floor in the tower

        2. Engaging Question Design:
        - Questions should be scenario-based where possible
        - Include practical applications of ${topic}
        - Make options distinct and plausible

        3. Progressive Difficulty:
        - Easy: Basic facts and definitions
        - Medium: Application of concepts
        - Hard: Complex problem-solving

        4. Structure Requirements:
        - 3 difficulty levels (Easy, Medium, Hard)
        - 3 waves per difficulty (9 total)
        - 3 questions per wave (27 total)
        - Maintain this exact JSON structure

        5. Output Rules:
        - Only return valid JSON
        - No additional commentary
        - Escape special characters properly
        - Keep property names exactly as shown

        Example of good question format:
        {
            "question": "As you reach the 2nd floor, which ${topic} concept helps solve this challenge?",
            "options": [
                "Basic principle A",
                "Common misconception B", 
                "Advanced technique C",
                "Irrelevant concept D"
            ],
            "correct_answer": "Basic principle A"
        }`;

        const chatSession = model.startChat({
            history: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        });

        const result = await chatSession.sendMessage("Generate the quiz");
        const response = result.response;
        const text = response.text();

        // Robust JSON parsing
        const jsonString = text.match(/\{[\s\S]*\}/)[0];
        const gameData = JSON.parse(jsonString);

        const newGame = new Game({
            user: userId,
            name: gameData.name || `${topic} Challenge`,
            skill,
            difficulty_levels: gameData.difficulty_levels,
            progress: {
                waves_cleared: { Easy: 0, Medium: 0, Hard: 0 },
                star_counts: { bronze: 0, silver: 0, gold: 0 },
                total_stars: 0,
                lives: 3
            }
        });

        await newGame.save();
        res.status(201).json({
            message: 'AI game generated successfully',
            game: newGame
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({
            message: 'Failed to generate game',
            error: error.message,
            details: error.stack
        });
    }
};

// Get game by ID
exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching game', error });
    }
};

// Handle wave completion
exports.completeWave = async (req, res) => {
    try {
        const { gameId, difficulty, waveNumber, userAnswers } = req.body; // Changed from correctAnswers to userAnswers
        
        if (!gameId || !difficulty || waveNumber === undefined || !userAnswers) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        const difficultyLevel = game.difficulty_levels[difficulty];
        if (!difficultyLevel) return res.status(400).json({ message: 'Invalid difficulty level' });

        const waveIndex = difficultyLevel.findIndex(w => w.wave === waveNumber);
        if (waveIndex === -1) return res.status(400).json({ message: 'Invalid wave number' });

        // Calculate stars by comparing user answers with correct answers
        let starsEarned = 0;
        difficultyLevel[waveIndex].questions.forEach((q, index) => {
            if (q.correct_answer === userAnswers[index]) starsEarned++;
        });

        // Update only the stars information
        difficultyLevel[waveIndex].stars_earned = starsEarned;
        
        // Update overall progress
        if (starsEarned > 0) {
            game.progress.waves_cleared[difficulty] = Math.max(
                game.progress.waves_cleared[difficulty],
                waveNumber
            );
            
            const starType = difficultyLevel[waveIndex].star_type;
            game.progress.star_counts[starType] += starsEarned;
            game.progress.total_stars += starsEarned;
        }

        await game.save();
        res.status(200).json({ 
            message: 'Wave completed',
            starsEarned,
            starType: difficultyLevel[waveIndex].star_type,
            game 
        });
    } catch (error) {
        console.error('Wave completion error:', error);
        res.status(500).json({ 
            message: 'Error completing wave',
            error: error.message 
        });
    }
};

// Get all games for a user
exports.getUserGames = async (req, res) => {
    try {
        const userId = req.params.userId;
        const games = await Game.find({ user: userId })
            .sort({ createdAt: -1 }) // Newest first
            .select('name skill progress difficulty_levels createdAt updatedAt');
        
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching user games', 
            error: error.message 
        });
    }
};

// Get user progress
exports.getProgress = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json({ progress: game.progress });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error });
    }
};

// Reset game progress
exports.resetGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        game.progress = {
            waves_cleared: { Easy: 0, Medium: 0, Hard: 0 },
            total_stars: 0,
            lives: 3
        };

        await game.save();
        res.status(200).json({ message: 'Game progress reset', game });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting game', error });
    }
};
