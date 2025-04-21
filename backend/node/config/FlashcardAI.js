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
const generateFlashcard = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Generate the flashcard on topic React Native in JSON format with front back content, Maximum 15" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n[\n  {\n    \"front\": \"What is React Native?\",\n    \"back\": \"A JavaScript framework for building native mobile apps using React.\"\n  },\n  {\n    \"front\": \"What programming languages are primarily used in React Native?\",\n    \"back\": \"JavaScript (ES6+) and JSX\"\n  },\n  {\n    \"front\": \"What are React Native components?\",\n    \"back\": \"Reusable UI elements, like `View`, `Text`, `Image`, etc.\"\n  },\n  {\n    \"front\": \"What is JSX?\",\n    \"back\": \"A syntax extension to JavaScript that allows you to write HTML-like structures.\"\n  },\n  {\n    \"front\": \"What is the purpose of `useState` hook in React Native?\",\n    \"back\": \"To manage the state of a functional component.\"\n  },\n  {\n    \"front\": \"What is the role of the `useEffect` hook?\",\n    \"back\": \"To perform side effects in functional components (e.g., data fetching, subscriptions).\"\n  },\n  {\n    \"front\": \"Name some common UI components in React Native.\",\n    \"back\": \"`View`, `Text`, `Image`, `TextInput`, `ScrollView`, `FlatList`\"\n  },\n  {\n    \"front\": \"What is the purpose of `StyleSheet` in React Native?\",\n    \"back\": \"To create and manage styles for React Native components.\"\n  },\n  {\n    \"front\": \"How does React Native render native UI components?\",\n    \"back\": \"Using JavaScript Bridge to communicate with native modules on iOS and Android.\"\n  },\n  {\n    \"front\": \"What are props in React Native?\",\n    \"back\": \"Data passed from a parent component to a child component.\"\n  },\n  {\n    \"front\": \"What is Expo?\",\n    \"back\": \"A framework and platform for universal React applications. Eases development and deployment.\"\n  },\n  {\n    \"front\": \"How do you handle user input in React Native?\",\n    \"back\": \"Using components like `TextInput` and handling events like `onChangeText`.\"\n  },\n  {\n    \"front\": \"What is a FlatList component used for?\",\n    \"back\": \"Efficiently rendering a large list of data.\"\n  },\n  {\n    \"front\": \"What is the advantage of using React Native?\",\n    \"back\": \"Code reusability between iOS and Android, faster development, and access to native features.\"\n  },\n    {\n    \"front\": \"How do you debug React Native apps?\",\n    \"back\": \"Using Chrome Developer Tools, React Native Debugger, or Flipper.\"\n  }\n]\n```" },
            ],
        },
    ],
});

module.exports = { generateFlashcard };