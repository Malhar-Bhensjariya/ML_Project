const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
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
  
    export const courseOutlineAIModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate a study material for Python for Exam and level of difficulty will be EASY with summary of course, list of Chapters along with summary for each chapter, Topic list in each chapter, All results in JSON format"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"course_title\": \"Python for Exams (Easy Level)\",\n  \"course_summary\": \"This course provides a gentle introduction to Python programming, designed for students preparing for introductory exams. It covers fundamental concepts, basic syntax, and essential programming techniques in a simplified and easy-to-understand manner.  The focus is on building a strong foundation for more advanced programming topics.\",\n  \"difficulty_level\": \"Easy\",\n  \"chapters\": [\n    {\n      \"chapter_number\": 1,\n      \"chapter_title\": \"Introduction to Python\",\n      \"chapter_summary\": \"This chapter introduces Python, its history, features, and why it's a popular language. It also covers setting up the Python environment and running simple Python programs.\",\n      \"topics\": [\n        \"What is Python?\",\n        \"History of Python\",\n        \"Features of Python (Readability, Interpreted, Cross-Platform)\",\n        \"Uses of Python (Brief Overview)\",\n        \"Installing Python (Windows, macOS, Linux - very basic instructions)\",\n        \"Running Python Code (Interactive mode and script files)\",\n        \"Your First Python Program (Printing 'Hello, World!')\",\n        \"Comments in Python (Single-line and multi-line)\"\n      ]\n    },\n    {\n      \"chapter_number\": 2,\n      \"chapter_title\": \"Variables and Data Types\",\n      \"chapter_summary\": \"This chapter explores variables, how to declare and assign values to them, and introduces basic data types like integers, floats, strings, and booleans. It also covers simple type conversions.\",\n      \"topics\": [\n        \"What are Variables?\",\n        \"Naming Conventions for Variables\",\n        \"Assigning Values to Variables\",\n        \"Data Types: Integers (int), Floating-Point Numbers (float), Strings (str), Booleans (bool)\",\n        \"Type Conversion (int(), float(), str(), bool()) - Simple Examples\",\n        \"Basic Arithmetic Operators (+, -, *, /, //, %)\"\n      ]\n    },\n    {\n      \"chapter_number\": 3,\n      \"chapter_title\": \"Input and Output\",\n      \"chapter_summary\": \"This chapter teaches how to take input from the user using the `input()` function and how to display output using the `print()` function. It also covers basic string formatting.\",\n      \"topics\": [\n        \"The `input()` Function (Taking user input)\",\n        \"Prompting the User for Input\",\n        \"The `print()` Function (Displaying output)\",\n        \"String Concatenation\",\n        \"String Formatting (Using f-strings - Simple Examples)\",\n        \"Escape Sequences (\\\\n, \\\\t, \\\\\\\") - Basic Usage\"\n      ]\n    },\n    {\n      \"chapter_number\": 4,\n      \"chapter_title\": \"Control Flow: Conditional Statements\",\n      \"chapter_summary\": \"This chapter introduces conditional statements (if, elif, else) to control the flow of execution based on certain conditions.\",\n      \"topics\": [\n        \"What are Conditional Statements?\",\n        \"The `if` Statement\",\n        \"The `else` Statement\",\n        \"The `elif` Statement\",\n        \"Comparison Operators (==, !=, >, <, >=, <=)\",\n        \"Logical Operators (and, or, not)\",\n        \"Nested `if` Statements (Simple Examples)\"\n      ]\n    },\n    {\n      \"chapter_number\": 5,\n      \"chapter_title\": \"Control Flow: Loops\",\n      \"chapter_summary\": \"This chapter covers looping constructs (for and while loops) to repeat blocks of code multiple times.\",\n      \"topics\": [\n        \"What are Loops?\",\n        \"The `for` Loop (Iterating over a range of numbers)\",\n        \"The `range()` Function\",\n        \"The `while` Loop\",\n        \"Loop Control Statements: `break` and `continue` (Simple Examples)\",\n        \"Nested Loops (Basic understanding)\"\n      ]\n    },\n    {\n      \"chapter_number\": 6,\n      \"chapter_title\": \"Data Structures: Lists\",\n      \"chapter_summary\": \"This chapter introduces lists, a fundamental data structure in Python, and covers basic list operations such as creating, accessing, and modifying lists.\",\n      \"topics\": [\n        \"What are Lists?\",\n        \"Creating Lists\",\n        \"Accessing List Elements (Indexing)\",\n        \"List Slicing\",\n        \"Modifying List Elements\",\n        \"List Methods: `append()`, `insert()`, `remove()`, `pop()` (Basic Usage)\",\n        \"List Length (`len()` function)\",\n        \"Iterating through a List using a `for` loop\"\n      ]\n    },\n    {\n      \"chapter_number\": 7,\n      \"chapter_title\": \"Functions\",\n      \"chapter_summary\": \"This chapter introduces functions, reusable blocks of code that perform specific tasks. It covers defining functions, passing arguments, and returning values.\",\n      \"topics\": [\n        \"What are Functions?\",\n        \"Defining a Function\",\n        \"Calling a Function\",\n        \"Function Arguments (Parameters)\",\n        \"Returning Values from a Function\",\n        \"Scope of Variables (Local vs. Global - Basic Understanding)\",\n        \"Built-in Functions (Brief overview of `len()`, `print()`, `input()`, `range()`)\"\n      ]\n    }\n  ]\n}\n```"},
          ],
        },
      ],
    });
  
    export const generateNotesAiModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate exam material detail content notes for each chapter, Make sure to includes all topic point in the content, make sure to give content in HTML format (Do not Add HTMLKL, Head, Body, title tag), The chapters : {\n\"chapter_title\": \"Introduction to Atoms\",\n\"summary\": \"This chapter introduces the concept of atoms as the smallest unit of an element, exploring their structure and key components.\",\n\"topics\": [\n\"What are atoms?\",\n\"Atomic structure: protons, neutrons, and electrons\",\n\"The periodic table and elements\",\n\"Atomic number and mass number\",\n\"Isotopes\"\n]\n}\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```html\n<h1>Chapter 1: Introduction to Atoms</h1>\n\n<h2>What are atoms?</h2>\n<p>Atoms are the fundamental building blocks of matter.  They are the smallest unit of an element that retains the chemical properties of that element.  This section will cover the historical development of the atomic theory, from Democritus to Dalton and beyond, explaining how the concept of the atom evolved.</p>\n\n\n<h2>Atomic structure: protons, neutrons, and electrons</h2>\n<p>Atoms are composed of subatomic particles: protons, neutrons, and electrons. Protons carry a positive charge, neutrons are neutral, and electrons carry a negative charge.  This section will detail the properties of each subatomic particle, including their mass, charge, and location within the atom (nucleus vs. electron cloud).  The concept of electron shells and energy levels will also be introduced.</p>\n\n<h2>The periodic table and elements</h2>\n<p>The periodic table is a systematic arrangement of all known elements. Elements are pure substances that cannot be broken down into simpler substances by chemical means.  This section will explain how the periodic table is organized based on atomic number and electron configuration, and how this organization reflects the periodic trends in the properties of elements.</p>\n\n<h2>Atomic number and mass number</h2>\n<p>The atomic number of an element represents the number of protons in the nucleus of an atom of that element. The mass number represents the total number of protons and neutrons in the nucleus. This section will explain how to determine the atomic number and mass number of an element, and how these numbers relate to the element's position on the periodic table.</p>\n\n\n<h2>Isotopes</h2>\n<p>Isotopes are atoms of the same element that have the same atomic number (same number of protons) but different mass numbers (different number of neutrons).  This section will explain how isotopes are formed and how they are represented using isotopic notation.  The concept of relative atomic mass and its calculation considering the abundance of different isotopes will also be discussed. Examples of common isotopes and their applications (e.g., carbon dating) will be explored.</p>\n```\n"},
          ],
        },
      ],
    });
  
    export const GenerateStudyTypeContentAiModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate the flashcard on topic: Flutter Fundamentals, User Interface (UI) Development, Basic App Navigation in JSON format with front back content, Maximum 15"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"front\": \"What is Flutter?\",\n    \"back\": \"Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.\"\n  },\n  {\n    \"front\": \"What is a Widget in Flutter?\",\n    \"back\": \"Everything in Flutter is a widget. Widgets describe what their view should look like given their current configuration and state.\"\n  },\n  {\n    \"front\": \"Differentiate between StatelessWidget and StatefulWidget.\",\n    \"back\": \"StatelessWidget: Immutable widgets, their properties cannot change after creation.\\nStatefulWidget: Mutable widgets, their properties can change during runtime.\"\n  },\n  {\n    \"front\": \"Name some common layout widgets in Flutter.\",\n    \"back\": \"Row, Column, Container, Padding, Center, SizedBox, Stack.\"\n  },\n  {\n    \"front\": \"How do you add padding around a widget?\",\n    \"back\": \"Use the `Padding` widget and specify the `padding` property with an `EdgeInsets` value.\"\n  },\n  {\n    \"front\": \"What is the purpose of the Container widget?\",\n    \"back\": \"The `Container` widget is a versatile widget that combines common painting, positioning, and sizing widgets. It can be used to add background color, padding, margin, borders, and more.\"\n  },\n  {\n    \"front\": \"How do you center a widget?\",\n    \"back\": \"Wrap the widget with the `Center` widget.\"\n  },\n  {\n    \"front\": \"What is a Scaffold in Flutter?\",\n    \"back\": \"The `Scaffold` widget provides a basic app layout structure.  It offers APIs for drawing drawers, snack bars, and bottom sheets. Often contains an `AppBar` and `Body`.\"\n  },\n  {\n    \"front\": \"What is the purpose of the AppBar widget?\",\n    \"back\": \"The `AppBar` widget is a horizontal bar displayed at the top of the screen, typically containing the app title and actions (like buttons).\"\n  },\n  {\n    \"front\": \"What is the `body` parameter in the `Scaffold` widget?\",\n    \"back\": \"The `body` parameter defines the main content of the screen, placed below the `AppBar`.\"\n  },\n  {\n    \"front\": \"What is `Navigator` in Flutter?\",\n    \"back\": \"The `Navigator` manages a stack of routes (screens) and provides methods for navigating between them (pushing and popping routes).\"\n  },\n  {\n    \"front\": \"How do you navigate to a new screen in Flutter?\",\n    \"back\": \"Use `Navigator.push(context, MaterialPageRoute(builder: (context) => NewScreen()));`\"\n  },\n  {\n    \"front\": \"How do you return to the previous screen in Flutter?\",\n    \"back\": \"Use `Navigator.pop(context);`\"\n  },\n  {\n    \"front\": \"What is a named route in Flutter navigation?\",\n    \"back\": \"A named route allows you to define a route with a name and navigate to it using `Navigator.pushNamed(context, '/routeName');`.\"\n  },\n  {\n    \"front\": \"What is the use of `BuildContext` in Flutter?\",\n    \"back\": \"BuildContext is a handle to the location of a widget in the widget tree.  It's used to access theme data, media queries, and perform navigation, among other things.\"\n  }\n]\n```"},
          ],
        },
      ],
    });

    export const GenerateQuizAiModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate Quiz on topic : React Native with Question and Options along with correct answer in JSON format, (Max 10)"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"question\": \"Which of the following is used to create UI components in React Native?\",\n    \"options\": [\n      \"Java\",\n      \"Kotlin\",\n      \"JavaScript\",\n      \"Swift\"\n    ],\n    \"correctAnswer\": \"JavaScript\"\n  },\n  {\n    \"question\": \"What is the primary purpose of 'StyleSheet' in React Native?\",\n    \"options\": [\n      \"Managing application state\",\n      \"Handling navigation\",\n      \"Creating reusable UI components\",\n      \"Defining styles for components\"\n    ],\n    \"correctAnswer\": \"Defining styles for components\"\n  },\n  {\n    \"question\": \"Which component is used for displaying text in React Native?\",\n    \"options\": [\n      \"<View>\",\n      \"<Text>\",\n      \"<Image>\",\n      \"<ScrollView>\"\n    ],\n    \"correctAnswer\": \"<Text>\"\n  },\n  {\n    \"question\": \"What is the role of 'props' in React Native?\",\n    \"options\": [\n      \"Managing component's internal state\",\n      \"Passing data from parent to child components\",\n      \"Handling user interactions\",\n      \"Styling components\"\n    ],\n    \"correctAnswer\": \"Passing data from parent to child components\"\n  },\n  {\n    \"question\": \"Which command is used to create a new React Native project?\",\n    \"options\": [\n      \"react-native init\",\n      \"npx create-react-native-app\",\n      \"npm install react-native\",\n      \"yarn add react-native\"\n    ],\n    \"correctAnswer\": \"npx create-react-native-app\" \n  },\n  {\n    \"question\": \"What is JSX in React Native?\",\n    \"options\": [\n      \"A JavaScript library\",\n      \"A syntax extension to JavaScript\",\n      \"A separate programming language\",\n      \"A styling framework\"\n    ],\n    \"correctAnswer\": \"A syntax extension to JavaScript\"\n  },\n  {\n    \"question\": \"Which component is used for handling user input in React Native?\",\n    \"options\": [\n      \"<TextInput>\",\n      \"<Button>\",\n      \"<Text>\",\n      \"<View>\"\n    ],\n    \"correctAnswer\": \"<TextInput>\"\n  },\n  {\n    \"question\": \"What is the purpose of 'state' in React Native?\",\n    \"options\": [\n      \"Passing data to child components\",\n      \"Managing internal component data that can change\",\n      \"Styling components\",\n      \"Handling navigation\"\n    ],\n    \"correctAnswer\": \"Managing internal component data that can change\"\n  },\n  {\n    \"question\": \"Which of these is NOT a core component of React Native?\",\n    \"options\": [\n      \"<View>\",\n      \"<Text>\",\n      \"<Image>\",\n      \"<BrowserRouter>\"\n    ],\n    \"correctAnswer\": \"<BrowserRouter>\"\n  },\n  {\n    \"question\": \"What is the function of 'FlatList' in React Native?\",\n    \"options\": [\n      \"Displaying a static list of items\",\n      \"Efficiently rendering large lists of data\",\n      \"Creating animations\",\n      \"Handling navigation\"\n    ],\n    \"correctAnswer\": \"Efficiently rendering large lists of data\"\n  }\n]\n```"},
          ],
        },
      ],
    });
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
    const prompts=[
      "Generate Quiz on topic : <Chapters> with Question and Options along with correct answer in JSON format, (Max 10)",
      "Generate the flashcard on topics:<Chapters> in JSON format with front back content, Maximum 15",
      "Generate Exam on topic : React Native with Question and Options along with correct answer in JSON format with difficulty level high but not very long questions and no need for difficulty key, (Give 10)"
    ]

    export const generateExamModel= model.startChat({
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
  
