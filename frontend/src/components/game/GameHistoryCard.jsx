import React from 'react';

const GameHistoryCard = ({ game, onSelect }) => {
    const getDifficultyProgress = (difficulty) => {
        const cleared = game.progress.waves_cleared[difficulty] || 0;
        return `${cleared}/3 waves cleared`;
    };

    const getStarCount = (type) => {
        return game.progress.star_counts[type] || 0;
    };

    return (
        <div 
            className="bg-gray-800/70 hover:bg-gray-700/80 transition-colors rounded-xl p-4 shadow-lg cursor-pointer border border-gray-700"
            onClick={() => onSelect(game._id)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white truncate pr-2">{game.name}</h3>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                    {new Date(game.updatedAt).toLocaleDateString()}
                </span>
            </div>
            
            <p className="text-gray-300 mb-4 truncate">{game.skill}</p>
            
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-yellow-900/30 rounded p-2 flex items-center justify-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className='text-white'>{getStarCount('bronze')}</span>
                </div>
                <div className="bg-gray-700/30 rounded p-2 flex items-center justify-center gap-1">
                    <span className="text-gray-300">✪</span>
                    <span className='text-white'>{getStarCount('silver')}</span>
                </div>
                <div className="bg-yellow-800/30 rounded p-2 flex items-center justify-center gap-1">
                    <span className="text-yellow-300">✯</span>
                    <span className='text-white'>{getStarCount('gold')}</span>
                </div>
            </div>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Easy:</span>
                    <span className="font-light text-white">{getDifficultyProgress('Easy')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Medium:</span>
                    <span className="font-light text-white">{getDifficultyProgress('Medium')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Hard:</span>
                    <span className="font-light text-white">{getDifficultyProgress('Hard')}</span>
                </div>
            </div>
        </div>
    );
};

export default GameHistoryCard;