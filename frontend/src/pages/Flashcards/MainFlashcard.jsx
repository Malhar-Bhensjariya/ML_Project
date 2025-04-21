import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RefreshCw, RotateCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import FlashCardItem from './FlashCardItem';

const Flashcards = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [flashCards, setFlashCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const NODE_API = import.meta.env.VITE_NODE_API;
  useEffect(() => {
    const fetchOrGenerateFlashcards = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to fetch existing flashcards
        const fetchResponse = await fetch(`${NODE_API}/flashcards/${courseId}`);
        
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          if (data.flashcards?.cards?.length > 0) {
            setFlashCards(data.flashcards.cards);
            return;
          }
        }
        
        // If no flashcards exist, generate new ones
        const generateResponse = await fetch(`${NODE_API}/genflashcards/${courseId}`, {
          method: 'POST'
        });
        
        if (!generateResponse.ok) throw new Error('Failed to generate flashcards');
        
        const generatedData = await generateResponse.json();
        setFlashCards(generatedData.flashcards.cards);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrGenerateFlashcards();
  }, [courseId]);

  // Handle flipping the card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Navigate to previous card
  const handlePrevious = () => {
    setCurrentCardIndex((prev) => 
      prev === 0 ? flashCards.length - 1 : prev - 1
    );
    setIsFlipped(false);
  };

  // Navigate to next card
  const handleNext = () => {
    setCurrentCardIndex((prev) => 
      prev === flashCards.length - 1 ? 0 : prev + 1
    );
    setIsFlipped(false);
  };

  // Reset to first card
  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.p 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-gray-500 text-lg"
        >
          {flashCards.length === 0 ? 'Generating flashcards...' : 'Loading flashcards...'}
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
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-3 p-6 bg-gradient-to-br from-[#F5F7FA] to-[#E6E9F0] min-h-screen flex flex-col justify-center">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(`/course/${courseId}`)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-2 md:mb-6 self-start"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Course
      </motion.button>

      <div className="text-center md:mb-2">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:text-4xl text-3xl font-extrabold bg-gradient-to-r from-[#8A4FFF] to-[#4E93FF] text-transparent bg-clip-text md:mb-4 mb-2"
        >
          Smart Flashcards
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 md:text-lg"
        >
          Learn Smarter, Not Harder
        </motion.p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <FlashCardItem 
            key={currentCardIndex}
            flashcard={flashCards[currentCardIndex]}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        </AnimatePresence>

        <div className="flex justify-center items-center space-x-6 md:mt-2">
          <motion.button 
            onClick={handlePrevious}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/40 transition-all shadow-lg"
          >
            <ChevronLeft className="text-[#8A4FFF] w-6 h-6" />
          </motion.button>

          <motion.button 
            onClick={handleReset}
            whileHover={{ rotate: 180 }}
            className="bg-gradient-to-r from-[#8A4FFF] to-[#4E93FF] p-4 rounded-full hover:from-[#7A3EEE] hover:to-[#3E82EE] transition-all shadow-xl"
          >
            <RefreshCw className="text-white w-6 h-6" />
          </motion.button>

          <motion.button 
            onClick={handleNext}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/40 transition-all shadow-lg"
          >
            <ChevronRight className="text-[#8A4FFF] w-6 h-6" />
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-sm text-gray-500 tracking-wider"
        >
          Card {currentCardIndex + 1} of {flashCards.length}
        </motion.div>
      </div>
    </div>
  );
};

export default Flashcards;