const express = require('express');
const router = express.Router();
const gameController = require('../controllers/GamificationController');

// Game CRUD Routes
router.post('/games', gameController.createGame);          // Create a new game
router.get('/games/:id', gameController.getGameById);     // Get game by ID
router.get('/games/user/:userId', gameController.getUserGames);

// Game Progress Routes
router.post('/games/complete-wave', gameController.completeWave);  // Complete a wave
router.get('/games/:id/progress', gameController.getProgress);     // Get game progress
router.post('/games/:id/reset', gameController.resetGame);         // Reset game progress

module.exports = router;