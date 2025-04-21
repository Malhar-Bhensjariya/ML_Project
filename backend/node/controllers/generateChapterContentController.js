const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// GEMINI SETUP
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

// YOUTUBE SETUP
const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// MAPPER FUNCTION FOR VIDEO DURATION CATEGORY
function getYouTubeDurationCategory(durationMinutes) {
    if (durationMinutes <= 10) return 'short';
    if (durationMinutes <= 30) return 'medium';
    return 'long';
}

// GEMINI CONTENT GENERATION FUNCTION
async function getChapterContent(chapterName, topics, difficulty) {
    let prompt = `
Generate structured JSON content for the chapter titled "${chapterName}" which is for the "${difficulty}" level. The chapter covers the following topics: ${topics.join(", ")}.

The content should be an array of sections, each section having:
- title: A brief title of the section.
- explanation: An explanation covering the section's topic (at least 4-5 sentences). For beginner levels, the explanation should be simple, while for intermediate and advanced levels, the explanation should dive deeper into the topic.
- codeExample: (if applicable) A small code snippet (if the topic is code-related), otherwise leave it empty.

Strictly return the JSON array without additional text.

Example:
[
    {
        "title": "Introduction to Variables",
        "explanation": "Variables are containers for storing data values. In JavaScript, variables can be declared using var, let, or const...",
        "codeExample": "let name = 'John';"
    },
    ...
]
    `;

    const chatSession = model.startChat({ generationConfig, history: [] });
    const aiResponse = await chatSession.sendMessage(prompt);
    const responseText = aiResponse.response.text();

    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Failed to parse Gemini response:", error);
        throw new Error("Failed to parse Gemini content.");
    }
}

// YOUTUBE VIDEO FETCH FUNCTION
async function getYouTubeVideo(query, durationCategory) {
    try {
        const durationFilter = {
            short: 'short',   // less than 4 minutes
            medium: 'medium', // 4 to 20 minutes
            long: 'long'      // 20+ minutes
        }[durationCategory];

        const params = {
            key: YOUTUBE_API_KEY,
            part: 'snippet',
            q: query,
            type: 'video',
            videoDuration: durationFilter,
            maxResults: 1
        };

        const { data } = await axios.get(YOUTUBE_URL, { params });

        if (data.items && data.items.length > 0) {
            const videoItem = data.items[0];
            const videoId = videoItem.id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const thumbnailUrl = videoItem.snippet.thumbnails?.high?.url || videoItem.snippet.thumbnails?.default?.url || "";

            return { url: videoUrl, thumbnail: thumbnailUrl };
        }

        return null;  // No video found
    } catch (error) {
        console.error("Error fetching video from YouTube:", error);
        throw new Error("Failed to fetch YouTube video.");
    }
}

const generateChapterContent = async (req, res) => {
    try {
        const { chapterName, about, duration, content, difficulty } = req.body;

        const sections = await getChapterContent(chapterName, content, difficulty);

        const videoDuration = getYouTubeDurationCategory(duration);
        const video = await getYouTubeVideo(chapterName, videoDuration);

        res.json({
            sections,
            video: video || { url: null, thumbnail: null }  // Handle if no video is found
        });
    } catch (error) {
        console.error('Error generating chapter content:', error);
        res.status(500).json({ error: 'Failed to generate chapter content.' });
    }
};

module.exports = { generateChapterContent };
