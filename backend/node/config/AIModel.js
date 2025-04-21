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
    
    
      const GenerateCourseLayout = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {text: "Generate A Course Tutorial on Following Detail With field Course Name, Description, Along with Course Outcomes, Chapter Name, About, Duration: Category: 'Programming', Topic: Python, Level: Basic, Duration: 1 hours, NoOf Chapters: 5, in JSON format."},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "```json\n{\n  \"Course Name\": \"Python Fundamentals for Beginners\",\n  \"Description\": \"This course provides a comprehensive introduction to the Python programming language, designed for individuals with no prior programming experience.  It covers fundamental concepts such as data types, control flow, functions, and basic input/output operations.  By the end of this course, you'll be equipped with the essential knowledge to write simple Python programs and understand more advanced topics.\",\n  \"Category\": \"Programming\",\n  \"Topic\": \"Python\",\n  \"Level\": \"Basic\",\n  \"Duration\": \"1 hour\",\n  \"NoOf Chapters\": 5,\n  \"Course Outcomes\": [\n    \"Understand the basic syntax and structure of Python code.\",\n    \"Be able to define and use variables, data types, and operators.\",\n    \"Implement conditional logic using if-else statements.\",\n    \"Create and utilize loops for repetitive tasks.\",\n    \"Define and call functions to organize code.\",\n    \"Read input from the user and display output to the console.\",\n    \"Write simple Python programs to solve basic problems.\"\n  ],\n  \"Chapters\": [\n    {\n      \"Chapter Name\": \"Introduction to Python\",\n      \"About\": \"This chapter introduces the Python programming language, its history, its uses, and how to set up your development environment.\",\n      \"Duration\": \"10 minutes\",\n      \"Content\": [\n        \"What is Python?\",\n        \"Why Learn Python?\",\n        \"Installing Python (and verifying installation)\",\n        \"Setting up a Code Editor (VS Code, PyCharm, etc.)\",\n        \"Writing and running your first Python program (Hello, World!)\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Data Types and Variables\",\n      \"About\": \"This chapter covers the fundamental data types in Python and how to declare and use variables.\",\n      \"Duration\": \"12 minutes\",\n      \"Content\": [\n        \"Variables: Naming Conventions and Assignment\",\n        \"Data Types: Integers, Floats, Strings, Booleans\",\n        \"Operators: Arithmetic, Comparison, Logical\",\n        \"Type Conversion (Casting)\",\n        \"Basic Input using `input()` function\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Control Flow: Conditional Statements\",\n      \"About\": \"This chapter explains how to use if, else, and elif statements to control the flow of execution in your program.\",\n      \"Duration\": \"13 minutes\",\n      \"Content\": [\n        \"The `if` statement\",\n        \"The `if-else` statement\",\n        \"The `if-elif-else` statement\",\n        \"Nested `if` statements\",\n        \"Using Comparison and Logical Operators in Conditions\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Control Flow: Loops\",\n      \"About\": \"This chapter covers the basics of loops - for and while -  and when to use each.\",\n      \"Duration\": \"15 minutes\",\n      \"Content\": [\n        \"The `for` loop: Iterating over sequences (strings, lists, ranges)\",\n        \"The `while` loop: Repeating code until a condition is met\",\n        \"`break` and `continue` statements\",\n        \"Nested Loops\",\n        \"Looping with `range()`\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Functions\",\n      \"About\": \"This chapter introduces the concept of functions, how to define them, and how to call them.\",\n      \"Duration\": \"10 minutes\",\n      \"Content\": [\n        \"Defining Functions: `def` keyword\",\n        \"Function Arguments (Parameters)\",\n        \"Return Values\",\n        \"Calling Functions\",\n        \"Scope of Variables (Local vs. Global)\",\n        \"Simple example of building a calculator function\"\n      ]\n    }\n  ]\n}\n```"},
            ],
          },
        ],
      });
    
      const generateExamModel= model.startChat({
            generationConfig,
            history: [
              {
                role: "user",
                parts: [
                  {text: "Generate Exam on topic : React Native with Question and Options along with correct answer in JSON format with difficulty level high but not very long questions and no need for difficulty key, (Give 10)"},
                ],
              },
              {
                role: "model",
                parts: [
                  {text: "```json\n[\n  {\n    \"question\": \"What is the primary benefit of using React Native's Fast Refresh feature during development?\",\n    \"options\": [\n      \"It automatically refactors your code to improve performance.\",\n      \"It provides real-time updates to your code without losing component state.\",\n      \"It allows you to debug your code directly on the device.\",\n      \"It generates optimized production builds faster.\"\n    ],\n    \"answer\": \"It provides real-time updates to your code without losing component state.\"\n  },\n  {\n    \"question\": \"How does React Native bridge the gap between JavaScript code and native platform components?\",\n    \"options\": [\n      \"It uses a JavaScript engine to interpret JavaScript code directly on the native platform.\",\n      \"It translates JavaScript code into native code at compile time.\",\n      \"It uses a message queue to asynchronously communicate between JavaScript and native threads.\",\n      \"It replaces native components with JavaScript-based alternatives.\"\n    ],\n    \"answer\": \"It uses a message queue to asynchronously communicate between JavaScript and native threads.\"\n  },\n  {\n    \"question\": \"What is the purpose of the `useCallback` hook in React Native functional components?\",\n    \"options\": [\n      \"To memoize the result of a function call and prevent unnecessary re-renders.\",\n      \"To manage the lifecycle of a functional component.\",\n      \"To define a function that is called when a component is unmounted.\",\n      \"To prevent the creation of a new function instance on every render.\"\n    ],\n    \"answer\": \"To prevent the creation of a new function instance on every render.\"\n  },\n  {\n    \"question\": \"Which React Native API is used to manage asynchronous operations and background tasks?\",\n    \"options\": [\n      \"AsyncStorage\",\n      \"Fetch\",\n      \"BackgroundFetch\",\n      \"Promise\"\n    ],\n    \"answer\": \"Fetch\"\n  },\n  {\n    \"question\": \"What is the significance of using the `Platform` API in React Native?\",\n    \"options\": [\n      \"To access platform-specific information and adapt code based on the operating system.\",\n      \"To directly modify the native UI components of the platform.\",\n      \"To optimize the performance of React Native applications for different screen sizes.\",\n      \"To enable cross-platform code sharing with web applications.\"\n    ],\n    \"answer\": \"To access platform-specific information and adapt code based on the operating system.\"\n  },\n  {\n    \"question\": \"When would you choose to use a `FlatList` component over a `ScrollView` in React Native?\",\n    \"options\": [\n      \"When you need to render a small, static list of items.\",\n      \"When you want to render a dynamic list of items with potentially large dataset that benefits from virtualization.\",\n      \"When you need to implement custom animations for scrolling.\",\n      \"When you want to create a fixed layout with no scrolling.\"\n    ],\n    \"answer\": \"When you want to render a dynamic list of items with potentially large dataset that benefits from virtualization.\"\n  },\n  {\n    \"question\": \"What is the purpose of using Redux or similar state management libraries in a React Native application?\",\n    \"options\": [\n      \"To simplify UI rendering and improve performance.\",\n      \"To manage global application state and facilitate data sharing between components.\",\n      \"To handle navigation and routing between different screens.\",\n      \"To implement persistent storage for user data.\"\n    ],\n    \"answer\": \"To manage global application state and facilitate data sharing between components.\"\n  },\n  {\n    \"question\": \"How can you improve the performance of a React Native application when dealing with complex animations?\",\n    \"options\": [\n      \"By using JavaScript-based animations exclusively.\",\n      \"By offloading animations to the native driver using `useNativeDriver: true`.\",\n      \"By reducing the number of animations used in the application.\",\n      \"By increasing the frame rate of animations.\"\n    ],\n    \"answer\": \"By offloading animations to the native driver using `useNativeDriver: true`.\"\n  },\n  {\n    \"question\": \"What is the recommended way to handle navigation between screens in a React Native application with a complex navigation structure?\",\n    \"options\": [\n      \"Using the built-in `Navigator` component.\",\n      \"Using a third-party navigation library like React Navigation or react-native-navigation.\",\n      \"Implementing custom navigation logic using state management.\",\n      \"Using deep linking to navigate between screens.\"\n    ],\n    \"answer\": \"Using a third-party navigation library like React Navigation or react-native-navigation.\"\n  },\n  {\n    \"question\": \"What are the advantages of using TypeScript with React Native projects?\",\n    \"options\": [\n      \"It automatically optimizes your code for performance.\",\n      \"It provides static typing, improved code maintainability, and early error detection.\",\n      \"It simplifies the process of building native modules.\",\n      \"It eliminates the need for testing.\"\n    ],\n    \"answer\": \"It provides static typing, improved code maintainability, and early error detection.\"\n  }\n]\n```"},
                ],
              },
            ],
          });
      // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
      // console.log(result.response.text());

      module.exports = { generateExamModel };
    
