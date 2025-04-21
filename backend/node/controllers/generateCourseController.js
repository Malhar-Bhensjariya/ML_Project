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

const generateCourseLayout = async (req, res) => {
    try {
        const { skills, topic, difficulty, duration, noOfChp } = req.body;

        const prompt = `
Generate a JSON object for a course on "${topic}". The course should cover the following skills: ${skills.join(", ")}. 
The course level should be "${difficulty}" and the total duration should be "${duration}" hours, divided into "${noOfChp}" chapters.

The JSON response should follow this structure:
{
  "Course Name": "${topic}",
  "Description": "Brief description of the course",
  "Skills": ["${skills.join('", "')}"],
  "Level": "${difficulty}",
  "Duration": "${duration} hours",
  "NoOfChapters": ${noOfChp},
  "Course Outcomes": [
    "Outcome 1",
    "Outcome 2",
    "Outcome 3"
  ],
  "Chapters": [
    {
      "Chapter Name": "Chapter 1 Title",
      "About": "Brief overview of the chapter",
      "Duration": "Duration (in minutes)",
      "Content": [
        "Topic 1",
        "Topic 2",
        "Topic 3"
      ]
    },
    // repeat for all chapters
  ]
}

Ensure the response strictly follows this schema in valid JSON format with no additional explanations.
`;


        const chatSession = model.startChat({ generationConfig, history: [] });
        const aiResponse = await chatSession.sendMessage(prompt);
        const responseText = aiResponse.response.text();

        res.json({ courseLayout: JSON.parse(responseText) });
    } catch (error) {
        console.error("AI generation error:", error);
        res.status(500).json({ error: "Failed to generate course layout." });
    }
};

module.exports = { generateCourseLayout };
