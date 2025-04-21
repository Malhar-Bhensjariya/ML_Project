export const flashCardContent=[
    {
      "front": "What is Flutter and what language is it primarily based on?",
      "back": "Flutter is a cross-platform UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase. It's based on the Dart programming language."
    },
    {
      "front": "What is a Widget in Flutter?",
      "back": "A Widget is the basic building block of a Flutter UI. Everything in Flutter is a Widget, from buttons and text to layout structures."
    },
    {
      "front": "What are the two main types of Widgets in Flutter?",
      "back": "StatelessWidgets and StatefulWidgets. StatelessWidget widgets are immutable, while StatefulWidget widgets can change their state over time."
    },
    {
      "front": "What is the difference between `StatefulWidget` and `StatelessWidget`?",
      "back": "`StatelessWidget` doesn't change once built, while `StatefulWidget` can rebuild itself with new data, using a `State` object."
    },
    {
      "front": "What is the `build()` method in a Flutter Widget?",
      "back": "The `build()` method describes how to display the Widget's UI. It returns the Widget hierarchy that represents the UI."
    },
    {
      "front": "What is the purpose of `Scaffold` Widget?",
      "back": "The `Scaffold` provides the basic visual structure for a Material Design app. It includes elements like AppBar, Body, Drawer, BottomNavigationBar, etc."
    },
    {
      "front": "Name three common layout Widgets in Flutter.",
      "back": "`Row`, `Column`, `Stack`, `Center`, `Container`, `Padding`, `Expanded`, `SizedBox` (Choose any three)"
    },
    {
      "front": "How do you add padding around a Widget?",
      "back": "Use the `Padding` widget.  Wrap the widget with `Padding(padding: EdgeInsets.all(16.0), child: YourWidget());`"
    },
    {
      "front": "How do you arrange Widgets horizontally?",
      "back": "Use the `Row` Widget."
    },
    {
      "front": "How do you arrange Widgets vertically?",
      "back": "Use the `Column` Widget."
    },
    {
      "front": "What is the purpose of the `Container` Widget?",
      "back": "The `Container` widget allows you to apply padding, margin, background color, borders, and other visual styling to its child widget."
    },
    {
      "front": "What is a `Navigator` in Flutter?",
      "back": "The `Navigator` manages the app's route stack.  It's used for pushing and popping routes (screens)."
    },
    {
      "front": "How do you navigate to a new screen in Flutter using `Navigator`?",
      "back": "Using `Navigator.push(context, MaterialPageRoute(builder: (context) => NewScreen()));`"
    },
    {
      "front": "How do you go back to the previous screen in Flutter using `Navigator`?",
      "back": "Using `Navigator.pop(context);`"
    },
    {
      "front": "What is the purpose of `MaterialApp` Widget?",
      "back": "The `MaterialApp` widget sets up the app's theme, title, routes, and other global configurations for a Material Design app."
    }
  ]