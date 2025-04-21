const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function generateCourseNotes({ courseName, description, skills, level, chapterNames }) {
  // Ensure all inputs are strings/arrays
  if (typeof courseName !== 'string' ||
    typeof description !== 'string' ||
    !Array.isArray(skills) ||
    typeof level !== 'string' ||
    !Array.isArray(chapterNames)) {
    throw new Error('Invalid input types');
  }

  const prompt = `Generate structured and extremely detailed course notes in JSON format based on:
- Course Name: ${courseName}
- Description: ${description}
- Skills: ${skills.join(', ')}
- Level: ${level}
- Chapters: ${chapterNames.join(', ')}

Output format:
{
  "courseName": "string",
  "skills": ["string"],
  "chapters": [
    {
      "chapterName": "string",
      "notes": {
        "explanation": "string", 
        "codeExample": "string|null"
      }
    }
  ]
}`;

  try {
    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    const text = response.text();

    // Parse and validate
    const notes = JSON.parse(text);
    if (!notes.courseName || !notes.chapters) {
      throw new Error('Invalid response format from Gemini');
    }

    return notes;
  } catch (error) {
    console.error("Generation error:", error);
    throw new Error(`Failed to generate notes: ${error.message}`);
  }
}

module.exports = { generateCourseNotes };
