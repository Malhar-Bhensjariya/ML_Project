import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft, RotateCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const NotesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const { user } = useUser();
  const token = user?.token;
  const NODE_API = import.meta.env.VITE_NODE_API;
  const fetchOrGenerateNotes = async (signal) => {
    try {
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      setLoading(true);
      setError(null);

      // 1. Try to fetch existing notes
      try {
        const response = await fetch(`${NODE_API}/notes/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal
        });

        if (response.ok) {
          const data = await response.json();
          setNotes(data);
          return;
        }

        // 404 is expected when notes don't exist yet
        if (response.status !== 404) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch notes: ${response.status}`);
        }
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.log('Fetch notes error:', fetchError.message);
        }
      }

      // 2. Get course details needed for generation
      const courseResponse = await fetch(`${NODE_API}/courses/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal
      });

      if (!courseResponse.ok) {
        const errorData = await courseResponse.json();
        throw new Error(errorData.error || 'Failed to fetch course details');
      }

      const courseData = await courseResponse.json();

      // 3. Generate and save notes in one call
      const generateResponse = await fetch(`${NODE_API}/notes/generate/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseName: courseData.courseName,
          description: courseData.description,
          skills: courseData.skills,
          level: courseData.level,
          chapters: courseData.chapters.map(ch => ch.chapterName)
        }),
        signal
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        console.error('Generation error details:', errorData);
        throw new Error(errorData.error || 'Failed to generate notes. Please check the course content and try again.');
      }

      const generatedNotes = await generateResponse.json();
      
      // Validate the generated notes structure
      if (!generatedNotes || !generatedNotes.chapters || 
          !Array.isArray(generatedNotes.chapters)) {
        throw new Error('Invalid notes format received from server');
      }

      // Validate each chapter has required fields
      generatedNotes.chapters.forEach(chapter => {
        if (!chapter.notes || !chapter.notes.explanation) {
          throw new Error(`Chapter "${chapter.chapterName}" is missing required explanation`);
        }
      });

      setNotes(generatedNotes);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Error in note processing:', err);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    if (token) {
      fetchOrGenerateNotes(controller.signal);
    } else {
      setError('Authentication required. Please login.');
      setLoading(false);
    }

    return () => controller.abort();
  }, [courseId, token]);

  const handlePreviousChapter = () => {
    setCurrentChapterIndex(prev => 
      prev === 0 ? 0 : prev - 1  // Prevent going below first chapter
    );
  };

  const handleNextChapter = () => {
    setCurrentChapterIndex(prev => 
      prev === notes.chapters.length - 1 ? prev : prev + 1  // Prevent going beyond last chapter
    );
  };

  const handleRegenerateNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const courseResponse = await fetch(`${NODE_API}/courses/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course details');
      }

      const courseData = await courseResponse.json();

      const generateResponse = await fetch(`${NODE_API}/notes/generate/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseName: courseData.courseName,
          description: courseData.description,
          skills: courseData.skills,
          level: courseData.level,
          chapters: courseData.chapters.map(ch => ch.chapterName)
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to regenerate notes');
      }

      const regeneratedNotes = await generateResponse.json();
      
      // Validate regenerated notes
      if (!regeneratedNotes?.chapters?.every(ch => ch.notes?.explanation)) {
        throw new Error('Regenerated notes are missing required fields');
      }

      setNotes(regeneratedNotes);
      setCurrentChapterIndex(0); // Reset to first chapter after regeneration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.p 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-gray-500 text-lg flex items-center"
        >
          <RotateCw className="animate-spin mr-2" />
          {notes ? 'Loading notes...' : 'Generating notes...'}
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
          <p className="text-red-500 text-lg">{error}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            {error.includes('Authentication') && (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-lg">No notes available for this course.</p>
      </div>
    );
  }

  const isFirstChapter = currentChapterIndex === 0;
  const isLastChapter = currentChapterIndex === notes.chapters.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(`/course/${courseId}`)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ChevronLeft className="mr-2" size={20} />
        Back to Course
      </motion.button>

      <div className="text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          {notes.courseName} Notes
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600"
        >
          Comprehensive learning notes for your course
        </motion.p>
        <button
          onClick={handleRegenerateNotes}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Regenerating...' : 'Regenerate Notes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {notes.chapters[currentChapterIndex].chapterName}
          </h3>
          <div className="text-sm text-gray-500">
            Chapter {currentChapterIndex + 1} of {notes.chapters.length}
          </div>
        </div>

        <div className="prose max-w-none">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Explanation</h4>
          <p className="text-gray-600 mb-6 whitespace-pre-line md:text-base text-sm">
            {notes.chapters[currentChapterIndex].notes.explanation}
          </p>

          {notes.chapters[currentChapterIndex].notes.codeExample && (
            <>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Code Example</h4>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
                <code>{notes.chapters[currentChapterIndex].notes.codeExample}</code>
              </pre>
            </>
          )}
        </div>

        <div className="flex justify-between mt-8 md:gap-0 gap-2">
          <button
            onClick={handlePreviousChapter}
            className={`md:px-4 px-2 py-2 rounded-lg transition-colors ${
              isFirstChapter 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isFirstChapter || loading}
          >
            Previous Chapter
          </button>
          
          {isLastChapter ? (
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Course
            </button>
          ) : (
            <button
              onClick={handleNextChapter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Next Chapter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;