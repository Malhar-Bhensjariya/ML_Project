import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const FlashCardItem = ({ flashcard, isFlipped, onFlip }) => {
  return (
    <motion.div 
      className="flex items-center justify-center w-full px-4 py-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.div 
        className="relative w-full max-w-md h-[300px] sm:h-[300px] cursor-pointer group"
        onClick={onFlip}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          damping: 15, 
          stiffness: 300 
        }}
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1500px'
        }}
      >
        {/* Refined Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8A4FFF] via-[#6A5AFF] to-[#4E93FF] rounded-3xl -z-10 opacity-60 group-hover:opacity-80 transition-all duration-500 blur-md group-hover:blur-lg"></div>

        {/* Front of the card */}
        <motion.div 
          className="absolute w-full h-full bg-white/90 backdrop-blur-lg text-gray-800 p-4 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            border: '2px solid transparent',
            backgroundClip: 'padding-box'
          }}
        >
          <div className="text-center space-y-4 w-full">
            <div className="bg-gradient-to-r from-[#8A4FFF] to-[#4E93FF] text-transparent bg-clip-text">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Question</h3>
            </div>
            <div className="flex-grow overflow-y-auto max-h-52 sm:max-h-64 px-2">
              <p className="text-sm sm:text-xl font-medium text-gray-700">{flashcard.front}</p>
            </div>
            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center mt-4">
              <div className="bg-gradient-to-r from-[#8A4FFF] to-[#4E93FF] px-3 sm:px-4 py-1 rounded-full text-white text-xs sm:text-sm flex items-center">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Tap to Reveal
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of the card */}
        <motion.div 
          className="absolute w-full h-full bg-gradient-to-br from-[#4ECDC4] via-[#45B7D1] to-[#4E93FF] text-white p-4 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: '2px solid transparent',
            backgroundClip: 'padding-box'
          }}
        >
          <div className="text-center space-y-4 w-full">
            <div className="bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0] text-transparent bg-clip-text">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Answer</h3>
            </div>
            <div className="flex-grow overflow-y-auto max-h-64 px-2">
              <p className="text-sm sm:text-xl font-medium text-white">{flashcard.back}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FlashCardItem;