import { useState, useEffect } from "react";
import { ChevronRight, Book, BookOpen, Lightbulb, Shield, Code, Star } from "lucide-react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
export default function LearningPath() {
    const [subject, setSubject] = useState("Web Development");
    const [currentTopic, setCurrentTopic] = useState("Security Headers");
    const [learningPath, setLearningPath] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    console.log(user)
    const generatePath = async () => {
        setIsLoading(true);
        try {
            const resp = await axios.post(
                "http://127.0.0.1:5004/api/topic/",
                {
                    "subject": subject,
                    "current_topic": currentTopic
                },
                { withCredentials: true }
            );
            //   console.log(resp.data.response)
            setLearningPath(resp.data.response)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };
    // Icons for each topic
    const topicIcons = {
        "Progressive Enhancement": <Lightbulb size={18} />,
        "WebAssembly": <Code size={18} />,
        "Service Workers": <Shield size={18} />,
        "Web Components": <BookOpen size={18} />,
        "Modern Frameworks": <Book size={18} />,
        "Accessibility Standards": <Star size={18} />
    };

    //   // Generate learning path
    //   const generatePath = () => {
    //     setIsLoading(true);

    //     // Simulate API call
    //     setTimeout(() => {
    //       // For demonstration, using the sample output
    //       setLearningPath([
    //         "Progressive Enhancement",
    //         "WebAssembly",
    //         "Service Workers",
    //         "Web Components",
    //         "Modern Frameworks",
    //         "Accessibility Standards"
    //       ]);
    //       setIsLoading(false);
    //     }, 1000);
    //   };

    //   useEffect(() => {
    //     generatePath();
    //   }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <h1 className="text-2xl font-bold">Adaptive Learning Path</h1>
                        <p className="opacity-80 mt-1">Creating personalized learning journeys</p>
                    </div>

                    {/* Input Form */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                {user && Array.isArray(user.skills) ? (
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        {user.skills.map((skill, idx) => (
                                        
                                            <option key={idx} value={skill.name}>
                                                {skill.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                )}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Topic
                                </label>
                                <input
                                    type="text"
                                    value={currentTopic}
                                    onChange={(e) => setCurrentTopic(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={generatePath}
                            disabled={isLoading}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
                        >
                            {isLoading ? "Generating..." : "Generate Learning Path"}
                        </button>
                    </div>

                    {/* Results */}
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Recommended Learning Path for {subject}
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-pulse bg-gray-200 h-4 w-full max-w-md rounded"></div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {learningPath.map((topic, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center p-3 rounded-lg transition-colors ${topic === currentTopic
                                                ? "bg-blue-100 border-l-4 border-blue-500"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                                            {topicIcons[topic] || <Book size={18} />}
                                        </div>
                                        <span className="font-medium text-gray-800">{topic}</span>
                                        {index < learningPath.length - 1 && (
                                            <ChevronRight className="ml-auto text-gray-400" size={20} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="bg-gray-50 p-6 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-500">Topics</p>
                            <p className="text-2xl font-bold text-gray-800">{learningPath.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Estimated Time</p>
                            <p className="text-2xl font-bold text-gray-800">{learningPath.length * 3}h</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Completion</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {Math.round((learningPath.indexOf(currentTopic) + 1) / learningPath.length * 100) || 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}