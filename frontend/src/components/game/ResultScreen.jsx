import React from 'react';

const ResultScreen = ({ 
    difficulty, 
    wave, 
    currentWaveStars, 
    totalStars,
    difficultyStars,
    onContinue 
}) => {
    const difficultyStyles = {
        Easy: {
            icon: '★',
            color: 'text-yellow-500',
            bg: 'bg-yellow-900/30',
            starColor: 'text-yellow-400',
            name: 'Bronze'
        },
        Medium: {
            icon: '✪',
            color: 'text-gray-300',
            bg: 'bg-gray-800/30',
            starColor: 'text-gray-300',
            name: 'Silver'
        },
        Hard: {
            icon: '✯',
            color: 'text-yellow-300',
            bg: 'bg-yellow-800/30',
            starColor: 'text-yellow-300',
            name: 'Gold'
        }
    };

    const styles = difficultyStyles[difficulty] || difficultyStyles.Easy;

    return (
        <div className={`max-w-md mx-auto p-8 rounded-xl shadow-2xl ${styles.bg}`}>
            <h1 className="text-3xl font-bold text-center mb-2">Wave Complete!</h1>
            <h2 className={`text-2xl text-center mb-2 md:mb-8 ${styles.color}`}>
                {difficulty} - Wave {wave}
            </h2>
            
            {/* Current Wave Stars */}
            <div className="mb-8 text-center">
                <h3 className="text-xl md:mb-4">You earned this wave:</h3>
                <div className="flex justify-center gap-4 md:mb-2">
                    {[...Array(3)].map((_, i) => (
                        <span 
                            key={i} 
                            className={`text-4xl ${i < currentWaveStars ? styles.starColor : 'text-gray-600'}`}
                        >
                            {styles.icon}
                        </span>
                    ))}
                </div>
                <p className="text-lg">
                    {currentWaveStars} out of 3 {styles.icon} stars
                </p>
            </div>

            {/* Difficulty Progress */}
            <div className="mb-6 text-center">
                <h3 className="text-xl mb-2">Total {styles.name} Stars:</h3>
                <div className="flex justify-center">
                    <span className="text-2xl font-bold">
                        {difficultyStars}
                    </span>
                </div>
            </div>

            {/* Overall Progress */}
            <div className="md:mb-8 mb-2 text-center">
                <h3 className="text-xl mb-2">Total Stars Collected:</h3>
                <div className="flex justify-center">
                    <span className="text-2xl font-bold">
                        {totalStars}
                    </span>
                </div>
            </div>

            <button 
                onClick={onContinue}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
                {wave < 3 ? 'Continue to Next Wave' : 'Return to Tower'}
            </button>
        </div>
    );
};

export default ResultScreen;