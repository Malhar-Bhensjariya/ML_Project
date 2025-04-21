import React, { useState } from 'react';
import axios from "axios";

function Transcript() {
    const [text, setText] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchData({secure_url,lectureId}) {
        try {
            setLoading(true);
            setError(null);
            const resp = await axios.post("http://127.0.0.1:5004/api/transcript/",{"path": secure_url,"lec_id":lectureId},{withCredentials: true});
            setText(resp.data);
        } catch (error) {
            console.error("Error fetching transcript:", error);
            setError("Failed to load transcript. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Video Transcript</h1>
            
            <div className="mb-6">
                <button 
                    onClick={fetchData}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : "Get Transcript"}
                </button>
            </div>
            
            {loading && (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}
            
            {error && (
                <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            {text && !loading && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-200 max-h-96 overflow-y-auto">
                        {typeof text === 'string' ? (
                            text.split('\n').map((line, index) => (
                                <p key={index} className="mb-2">
                                    {line || <br />}
                                </p>
                            ))
                        ) : (
                            <pre className="whitespace-pre-wrap">{JSON.stringify(text, null, 2)}</pre>
                        )}
                    </div>
                </div>
            )}
            
            {!text && !loading && !error && (
                <div className="py-12 text-center text-gray-500">
                    Click the button above to retrieve the video transcript
                </div>
            )}
        </div>
    );
}

export default Transcript;