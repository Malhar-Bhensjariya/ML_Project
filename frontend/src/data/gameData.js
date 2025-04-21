const gameData = {
    "React Native Tower": {
      "Easy": [
        {
          "wave": 1,
          "questions": [
            {
              "question": "Welcome, Trainee! What's the core component library used in React Native for building UIs?",
              "options": ["HTML", "DOM", "React Native Core Components", "CSS"],
              "correct_answer": "React Native Core Components"
            },
            {
              "question": "First Step! Which of these is NOT a core component in React Native?",
              "options": ["View", "Text", "Image", "Div"],
              "correct_answer": "Div"
            },
            {
              "question": "Nice Start! How do you typically style components in React Native?",
              "options": ["Inline CSS", "External CSS files", "StyleSheet API", "SASS"],
              "correct_answer": "StyleSheet API"
            }
          ]
        },
        {
          "wave": 2,
          "questions": [
            {
              "question": "Moving On! What command is used to initialize a new React Native project?",
              "options": ["create-react-app", "npx react-native init", "npm start", "yarn add react-native"],
              "correct_answer": "npx react-native init"
            },
            {
              "question": "Great Job! What's the purpose of the 'setState' method in React Native?",
              "options": [
                "To define a function",
                "To update the component's state and trigger a re-render",
                "To create a new component",
                "To style a component"
              ],
              "correct_answer": "To update the component's state and trigger a re-render"
            },
            {
              "question": "Almost there! Which property is used to make a component visible or invisible?",
              "options": ["display", "visibility", "opacity", "hidden"],
              "correct_answer": "display"
            }
          ]
        },
        {
          "wave": 3,
          "questions": [
            {
              "question": "Final Step! What is JSX?",
              "options": [
                "A JavaScript library",
                "A CSS preprocessor",
                "A syntax extension to JavaScript",
                "A database query language"
              ],
              "correct_answer": "A syntax extension to JavaScript"
            },
            {
              "question": "You're almost done! What is the purpose of the 'ScrollView' component?",
              "options": [
                "To create a fixed-size container",
                "To enable scrolling of content that overflows the container",
                "To display images",
                "To handle touch events"
              ],
              "correct_answer": "To enable scrolling of content that overflows the container"
            },
            {
              "question": "Level Cleared! Which tool do you use for debugging in React Native?",
              "options": ["Chrome DevTools", "React Native Debugger", "Both Chrome DevTools and React Native Debugger", "VSCode Debugger"],
              "correct_answer": "Both Chrome DevTools and React Native Debugger"
            }
          ]
        }
      ],
      "Medium": [
        {
          "wave": 1,
          "questions": [
            {
              "question": "A challenger approaches! What is the primary difference between 'FlatList' and 'ScrollView'?",
              "options": [
                "FlatList is for horizontal scrolling, ScrollView is for vertical scrolling",
                "FlatList is more performant for large lists",
                "ScrollView is easier to use",
                "They are interchangeable"
              ],
              "correct_answer": "FlatList is more performant for large lists"
            },
            {
              "question": "Enemies are approaching! What is the role of the 'SafeAreaView' component?",
              "options": [
                "To provide a default background color",
                "To render content in the safe area of the device screen",
                "To create a responsive layout",
                "To handle touch events"
              ],
              "correct_answer": "To render content in the safe area of the device screen"
            },
            {
              "question": "Careful Now! What are Props in React Native?",
              "options": [
                "A way to manage state",
                "Data passed from a parent component to a child component",
                "A type of event handler",
                "A styling method"
              ],
              "correct_answer": "Data passed from a parent component to a child component"
            }
          ]
        },
        {
          "wave": 2,
          "questions": [
            {
              "question": "Dodge this! How can you pass data between screens using React Navigation?",
              "options": ["Using global variables", "Using 'props.history.push'", "Using 'route.params'", "Using localStorage"],
              "correct_answer": "Using 'route.params'"
            },
            {
              "question": "Don't get hit! What is the purpose of using 'useEffect' hook?",
              "options": [
                "To render components",
                "To perform side effects in functional components",
                "To define styles",
                "To create a class component"
              ],
              "correct_answer": "To perform side effects in functional components"
            },
            {
              "question": "Almost there! Which package is commonly used for managing state in larger React Native applications?",
              "options": ["Redux", "MobX", "Context API", "All of the above"],
              "correct_answer": "All of the above"
            }
          ]
        }
      ],
      "Hard": [
        {
          "wave": 1,
          "questions": [
            {
              "question": "Incoming Boss! What is the purpose of using bridge in React Native?",
              "options": [
                "To connect two React Native components",
                "To enable communication between JavaScript and native code",
                "To create animations",
                "To handle navigation"
              ],
              "correct_answer": "To enable communication between JavaScript and native code"
            },
            {
              "question": "Here Comes the Pain! Explain the concept of CodePush in React Native.",
              "options": [
                "A way to manage app secrets",
                "A service that enables developers to deploy mobile app updates directly to users' devices",
                "A tool for creating native modules",
                "A debugging tool"
              ],
              "correct_answer": "A service that enables developers to deploy mobile app updates directly to users' devices"
            },
            {
              "question": "Dodge the fire! What are the advantages of using React Native's Fast Refresh?",
              "options": [
                "Faster build times",
                "Instant feedback on changes without losing component state",
                "Smaller bundle size",
                "Automatic code formatting"
              ],
              "correct_answer": "Instant feedback on changes without losing component state"
            }
          ]
        }
      ]
    }
  }  
  
export default gameData;