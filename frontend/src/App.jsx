import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import { UserProvider } from "./context/UserContext";
// import { SocketProvider } from './context/SocketContext';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CreateCourse from "./pages/CourseGen/CreateCourse";
import MyCourses from "./pages/CourseGen/MyCourses";
import ExamDashboard from "./pages/Assessment/ExamDashboard";
import Exam from "./pages/Assessment/Exam";
import ExamReview from "./pages/Assessment/ExamReview";
import MainLayout from "./MainLayout";
import ChapterDetails from "./pages/CourseGen/ChapterDetails";
import StartInterview from "./pages/Interview/StartInterview";
import MainInterview from "./pages/Interview/MainInterview";
import Feedback from "./pages/Interview/Feedback";
import InterviewDashboard from "./pages/Interview/InterviewDashboard";
import ProfilePage from "./pages/Auth/ProfilePage";
import AIProjectRecommendations from "./pages/ProjectRecommendation/AIProjectRecommendations";
import CourseAssessment from "./pages/CourseGen/CourseAssessment";
import InternshipListings from "./components/misc/InternshipListings";
import Landing from "./pages/Landing";
import CodeEditor from "./components/misc/Coding";
import PDFChatComponent from "./components/chatpdf/PDFChatComponent";
import NotesFlashcard from "./pages/CourseGen/NotesFlashcard";
import MainCourseDetails from "./pages/CourseGen/MainCourseDetails";
import MainFlashcard from "./pages/Flashcards/MainFlashcard";
import GamePage from "./pages/Gamification/GamePage";
import NotesPage from "./pages/Notes/NotesPage";
import LearningPath from "./pages/LearningPath/LearningPath";
import CreateRecommend from "./pages/CourseGen/CreateRecommend";

const App = () => (
  <UserProvider>
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/create-recommendation" element={<CreateRecommend />} />
          {/* <Route path="/course/:courseId" element={<CourseDetails />} /> */}
          <Route path="/course/:courseId" element={<MainCourseDetails />} />
          <Route
            path="/course/:courseId/chapter/:chapterId"
            element={<ChapterDetails />}
          />
          <Route path="/assessment" element={<ExamDashboard />} />
          <Route path="/interview" element={<InterviewDashboard />} />
          <Route
            path="/interview/:interviewId/feedback"
            element={<Feedback />}
          />
          <Route path="/internships" element={<InternshipListings />} />
          <Route path="/coding" element={<CodeEditor />} />
          <Route path="/chat-with-pdf" element={<PDFChatComponent />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/learning-path" element={<LearningPath />} />

          <Route
            path="/recommend-projects"
            element={<AIProjectRecommendations />}
          />


          <Route path="/flashcards/:courseId" element={<MainFlashcard />} />
          <Route path="/notes/:courseId" element={<NotesPage />} />
        </Route>

        <Route path="/interview/:interviewId" element={<StartInterview />} />
        <Route path='/interview/:interviewId/start' element={<MainInterview />} />
        <Route path="/assessment/:examId" element={<Exam />} />
        <Route path="/course/:courseId/course-assessment" element={<CourseAssessment />} />
        <Route path="/examreview" element={<ExamReview />} />
        <Route path="/flashcard" element={<NotesFlashcard />} />

      </Routes>
    </Router>
  </UserProvider>
);

export default App;
