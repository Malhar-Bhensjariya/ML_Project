import React, { useState, useMemo, useRef } from 'react';
import GameCard from '../../components/game/GameCard';
import GameQuestions from '../../components/game/GameQuestions';
import ResultScreen from '../../components/game/ResultScreen';
import GameHistoryCard from '../../components/game/GameHistoryCard';
import skillList from '../../data/skillList';
import { useUser } from '../../context/UserContext';

const GamePage = () => {
    const { user } = useUser();
    const [currentView, setCurrentView] = useState('gameSelection');
    const [currentDifficulty, setCurrentDifficulty] = useState(null);
    const [currentWave, setCurrentWave] = useState(0);
    const [gameProgress, setGameProgress] = useState({
        waves_cleared: { Easy: 0, Medium: 0, Hard: 0 },
        star_counts: { bronze: 0, silver: 0, gold: 0 },
        total_stars: 0,
        lives: 3
    });
    const [selectedSkill, setSelectedSkill] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [generatedGame, setGeneratedGame] = useState(null);
    const [currentGameId, setCurrentGameId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [userGames, setUserGames] = useState([]);
    const [lastWaveResult, setLastWaveResult] = useState(null);
    const dropdownRef = useRef(null);
    const NODE_API = import.meta.env.VITE_NODE_API;
    // Filter skills based on search term
    const filteredSkills = useMemo(() => {
        return skillList.filter(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const createGame = async (topic, skill) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${NODE_API}/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ 
                    topic, 
                    skill,
                    userId: user._id 
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        } finally {
            setIsLoading(false);
        }
    };

    const completeWaveAPI = async (gameId, difficulty, waveNumber, userAnswers) => {
        const response = await fetch(`${NODE_API}/games/complete-wave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                gameId,
                difficulty,
                waveNumber,
                userAnswers
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    };

    const fetchUserGames = async () => {
        try {
            console.log("ID: ", user._id);
            console.log("Token: ", user.token);
            const response = await fetch(`${NODE_API}/games/user/${user._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setUserGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
            alert('Failed to load game history');
        }
    };

    const handleGenerateGame = async () => {
        if (!selectedSkill) return;
        
        try {
            const result = await createGame(selectedSkill, selectedSkill);
            setGeneratedGame(result.game);
            setCurrentGameId(result.game._id);
            setGameProgress(result.game.progress);
            setShowHistory(false);
        } catch (error) {
            alert(`Failed to generate game: ${error.message}`);
        }
    };

    const startWave = (difficulty, wave) => {
        setCurrentDifficulty(difficulty);
        setCurrentWave(wave);
        setCurrentView('playing');
    };

    const completeWave = async (userAnswers) => {
        try {
            const result = await completeWaveAPI(
                currentGameId,
                currentDifficulty,
                currentWave,
                userAnswers
            );
            setGameProgress(result.game.progress);
            setLastWaveResult(result); // Store the result
            setCurrentView('results');
        } catch (error) {
            alert(`Error completing wave: ${error.message}`);
            console.error('Complete wave error:', error);
        }
    };

    const returnToSelection = () => {
        setCurrentView('gameSelection');
    };

    const handleSkillSelect = (skill) => {
        setSelectedSkill(skill);
        setSearchTerm(skill);
        setShowDropdown(false);
    };

    return (
        <div className="relative min-h-screen px-4">
            <div 
                className="fixed top-0 left-0 right-0 bottom-0 bg-cover bg-center z-0 opacity-50 pointer-events-none"
                style={{ 
                    backgroundImage: 'url("https://i.pinimg.com/736x/5b/53/69/5b5369acf7d3601d81faa35ad42d76c3.jpg")',
                    filter: 'brightness(0.6) contrast(1.2)'
                }}
            ></div>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white text-2xl">Generating game...</div>
                </div>
            )}

            {currentView === 'gameSelection' && (
                <div className="relative z-10 max-w-4xl mx-auto bg-gray-900 bg-opacity-70 p-8 rounded-xl shadow-2xl mt-12">
                    <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                        Tower of Knowledge
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 relative">
                        <div className="relative w-full sm:w-auto text-white" ref={dropdownRef}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                    if (!e.target.value) {
                                        setSelectedSkill('');
                                    }
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        if (!dropdownRef.current?.contains(document.activeElement)) {
                                            setShowDropdown(false);
                                        }
                                    }, 200);
                                }}
                                placeholder="Select Skill"
                                className="px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                            />
                            {showDropdown && (
                                <div className="absolute z-20 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-600">
                                    {filteredSkills.length > 0 ? (
                                        filteredSkills.map((skill) => (
                                            <div
                                                key={skill}
                                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleSkillSelect(skill)}
                                            >
                                                {skill}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-400">No skills found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleGenerateGame}
                            disabled={!selectedSkill}
                            className={`px-6 py-2 rounded transition-colors focus:outline-none focus:ring-2 w-full sm:w-auto ${
                                selectedSkill 
                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                                    : 'bg-gray-600 cursor-not-allowed'
                            }`}
                        >
                            Generate Game
                        </button>
                    </div>

                    <div className="mt-6">
                        <button 
                            onClick={() => {
                                setShowHistory(!showHistory);
                                if (!showHistory && userGames.length === 0) fetchUserGames();
                            }}
                            className={`w-full py-3 rounded-lg transition-colors mb-4 ${
                                showHistory 
                                    ? 'bg-gray-600 hover:bg-gray-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {showHistory ? 'Hide My Games' : 'Show My Games'}
                        </button>
                        
                        {showHistory ? (
                            <div className="mt-4">
                                <h2 className="text-2xl font-semibold text-white mb-4">My Game History</h2>
                                
                                {userGames.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                        {userGames.map(game => (
                                            <GameHistoryCard 
                                                key={game._id}
                                                game={game}
                                                onSelect={(gameId) => {
                                                    setCurrentGameId(gameId);
                                                    const selectedGame = userGames.find(g => g._id === gameId);
                                                    setGeneratedGame(selectedGame);
                                                    setGameProgress(selectedGame.progress);
                                                    setShowHistory(false);
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-800/50 rounded-lg">
                                        <p className="text-gray-400">No previous games found</p>
                                        <button 
                                            onClick={fetchUserGames}
                                            className="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : generatedGame && (
                            <div className="space-y-6">
                                {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                                    <GameCard
                                        key={difficulty}
                                        difficulty={difficulty}
                                        progress={gameProgress.waves_cleared[difficulty]}
                                        maxWaves={3}
                                        onSelect={(wave) => startWave(difficulty, wave)}
                                        isLocked={
                                            (difficulty === 'Medium' && gameProgress.waves_cleared.Easy < 3) ||
                                            (difficulty === 'Hard' && gameProgress.waves_cleared.Medium < 3)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {currentView === 'playing' && generatedGame && (
                <div className="relative z-10">
                    <GameQuestions
                        questions={generatedGame.difficulty_levels[currentDifficulty][currentWave - 1].questions}
                        onComplete={completeWave}
                        onBack={returnToSelection}
                    />
                </div>
            )}

            {currentView === 'results' && (
                <div className="relative z-10">
                    <ResultScreen
                        difficulty={currentDifficulty}
                        wave={currentWave}
                        currentWaveStars={lastWaveResult?.starsEarned || 0}
                        totalStars={gameProgress.total_stars}
                        difficultyStars={gameProgress.star_counts[currentDifficulty.toLowerCase()] || 0}
                        onContinue={() => {
                            if (currentWave < 3) {
                                startWave(currentDifficulty, currentWave + 1);
                            } else {
                                returnToSelection();
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default GamePage;