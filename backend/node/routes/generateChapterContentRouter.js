const express = require('express');
const router = express.Router();
const { generateChapterContent } = require('../controllers/generateChapterContentController');

router.post('/generate-chapter-content', generateChapterContent);

module.exports = router;
