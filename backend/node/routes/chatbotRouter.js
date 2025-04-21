const express = require('express');
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Chatbot API route
router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant in a Learning Management System. Help students by answering their doubts.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'Llama3-8b-8192',
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error('Error processing chatbot request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
