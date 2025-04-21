import React from 'react';

const GameCard = ({ difficulty, progress, maxWaves, onSelect, isLocked }) => {
  const difficultyStyles = {
    Easy: {
      bg: 'bg-gradient-to-b from-yellow-800 to-yellow-700',
      border: 'border-yellow-600',
      icon: '★',
      text: 'text-yellow-300',
      hover: 'hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]'
    },
    Medium: {
      bg: 'bg-gradient-to-b from-gray-600 to-gray-500',
      border: 'border-gray-400',
      icon: '✪',
      text: 'text-gray-200',
      hover: 'hover:shadow-[0_0_15px_rgba(209,213,219,0.5)]'
    },
    Hard: {
      bg: 'bg-gradient-to-b from-yellow-600 to-yellow-500',
      border: 'border-yellow-300',
      icon: '✯',
      text: 'text-yellow-200',
      hover: 'hover:shadow-[0_0_15px_rgba(253,230,138,0.5)]'
    }
  };

  return (
    <div className={`relative p-6 rounded-xl ${difficultyStyles[difficulty].bg} border-2 ${difficultyStyles[difficulty].border} ${
      isLocked ? 'opacity-60' : difficultyStyles[difficulty].hover
    } transition-all duration-300 ${!isLocked ? 'hover:scale-105' : ''}`}>
      <h2 className={`text-2xl font-bold mb-4 ${difficultyStyles[difficulty].text}`}>
        {difficulty}
      </h2>
      
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: maxWaves }).map((_, i) => (
          <button
            key={i}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
              i < progress ? 'bg-black/30' : 'bg-black/10'
            } ${
              !isLocked && i <= progress ? 'hover:bg-black/40 cursor-pointer' : 'cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-white/50`}
            onClick={() => !isLocked && i <= progress && onSelect(i + 1)}
          >
            <span className={`text-2xl ${i < progress ? difficultyStyles[difficulty].text : 'text-gray-400'}`}>
              {difficultyStyles[difficulty].icon}
            </span>
            <span className="text-sm mt-1">Wave {i + 1}</span>
          </button>
        ))}
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <span className="text-4xl">🔒</span>
        </div>
      )}
    </div>
  );
};

export default GameCard;