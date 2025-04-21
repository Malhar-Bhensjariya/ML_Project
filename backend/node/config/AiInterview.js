const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
const apiKey = process.env.GEMINI_API_KEY2;
const genAI = new GoogleGenerativeAI(apiKey);
  
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
  
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Job Position: Full stack developer, Job Description: React js,Node js, Years Of Experience: 2. Depending on this information, give me 5 interview questions with their answers in JSON format."},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n[\n  {\n    \"question\": \"Describe your experience with React.js. What types of projects have you worked on, and what aspects of the framework are you most comfortable with?\",\n    \"answer\": \"I have 2 years of experience developing web applications using React.js. My projects have included e-commerce platforms, data visualization dashboards, and interactive web portals. I'm proficient in building reusable components, managing application state with tools like Redux or Context API, and implementing client-side routing.  I'm also familiar with testing frameworks like Jest and Enzyme and have experience with performance optimization techniques.  For example, in a recent project, I implemented code splitting and lazy loading to significantly improve the initial load time of the application.\"\n  },\n  {\n    \"question\": \"Explain your understanding of Node.js and its role in a full-stack application.  Can you describe a specific project where you utilized Node.js?\",\n    \"answer\": \"Node.js is a JavaScript runtime environment that allows developers to build server-side applications.  It uses an event-driven, non-blocking I/O model, making it efficient and scalable. In a full-stack application, Node.js typically handles tasks like serving the application, handling API requests, interacting with databases, and managing user authentication. In a recent project, I built the backend of a real-time chat application using Node.js with Express.js for routing and Socket.IO for managing the WebSocket connections.  This allowed for instantaneous communication between users.\"\n  },\n  {\n    \"question\": \"How do you approach debugging and troubleshooting issues in a full-stack application, both on the front-end (React) and back-end (Node.js)?\",\n    \"answer\": \"My approach to debugging involves a combination of browser developer tools for front-end issues and debugging tools within my IDE or the command line for server-side issues.  For React, I utilize React Developer Tools to inspect component hierarchies, state, and props.  On the Node.js side, I might use the built-in debugger or logging statements to track the flow of execution. I also believe in writing unit and integration tests to catch errors early in the development process. For more complex issues, I utilize tools like network monitoring tools to inspect API requests and responses and profiling tools to identify performance bottlenecks.\"\n  },\n  {\n    \"question\": \"Describe your experience with databases and how you integrate them with Node.js and React.  What types of databases are you familiar with?\",\n    \"answer\": \"I've worked with both SQL and NoSQL databases, including PostgreSQL, MySQL, and MongoDB.  I typically interact with databases in Node.js using ORMs or database drivers, depending on the project's needs. For example, I might use Sequelize with PostgreSQL or Mongoose with MongoDB. On the React side, I fetch data from the backend APIs I build with Node.js.  I focus on writing efficient queries and optimizing database interactions to ensure good application performance.  I also understand the importance of data integrity and security.\"\n  },\n  {\n    \"question\": \"Given your 2 years of experience, describe a situation where you faced a significant technical challenge in a project and how you overcame it.\",\n    \"answer\": \"In a previous project involving a complex data visualization dashboard, we encountered performance issues when rendering a large dataset in React.  The initial render was slow, and user interactions were lagging.  After profiling the application, I identified that the bottleneck was in the rendering of a complex component that was re-rendering unnecessarily. To address this, I implemented memoization techniques using `useMemo` and `React.memo` to prevent unnecessary re-renders.  I also optimized the component's logic to reduce the amount of computation being performed during each render. This significantly improved the application's performance and responsiveness.\"\n  }\n]\n```"},
      ],
    },
  ],
});


module.exports = { chatSession };