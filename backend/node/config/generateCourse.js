const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

router.post("/generate-course", async (req, res) => {
    const { category, topic, difficulty, duration, noOfChp } = req.body;

    const prompt = `
        Generate A Course Tutorial on Following Detail With field Course Name, Description,
        Along with Chapter Name, About, Duration:
        Category: ${category}, Topic: ${topic}, Level: ${difficulty}, Duration: ${duration}, No Of Chapters: ${noOfChp}, in JSON format.
    `;

    const chatSession = model.startChat({ generationConfig, history: [] });

    try {
        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();
        res.json(JSON.parse(responseText));  // Send parsed JSON response
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate course." });
    }
});

module.exports = router;
