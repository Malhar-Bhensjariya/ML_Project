// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useUser } from "../../context/UserContext";

// const Similarity = () => {
//     const { user } = useUser(); // Assuming the admin is logged in
//     const [selectedMenteeId, setSelectedMenteeId] = useState("");
//     const [professors, setProfessors] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [assigning, setAssigning] = useState({});
//     const [mentees, setMentees] = useState([]); // Initialize as an empty array to prevent issues
//     const NODE_API = import.meta.env.VITE_NODE_API;
//     // Find the selected mentee (Only if mentees are available)
//     const selectedMentee = mentees.length > 0 ? mentees.find(mentee => mentee._id === selectedMenteeId) : null;

//     // Fetch mentees from API
//     async function fetchMentees() {
//         try {
//             setLoading(true);
//             const response = await axios.get("http://127.0.0.1:5004/users/all-mentees", { withCredentials: true });

//             console.log("Fetched mentees:", response.data);
//             if (response.data && response.data.mentees) {
//                 setMentees(response.data.mentees);
//             }
//         } catch (error) {
//             console.error("Error fetching mentees:", error.response?.data || error.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchMentees();
//     }, []);

//     useEffect(() => {
//         if (selectedMenteeId) {
//             fetchProfessors();
//         }
//     }, [selectedMenteeId]);

//     async function fetchProfessors() {
//         try {
//             setLoading(true);
//             const response = await axios.post(
//                 "http://127.0.0.1:5004/mentor-mentee/",
//                 { "user_id": selectedMenteeId },
//                 { withCredentials: true }
//             );
//             console.log("Fetched Professors:", response.data);
//             setProfessors(response.data);
//         } catch (error) {
//             console.error("Error fetching professors:", error.response?.data || error.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const assignProfessor = async (professorId) => {
//         if (!selectedMenteeId) {
//             alert("Please select a mentee first.");
//             return;
//         }

//         setAssigning((prev) => ({ ...prev, [professorId]: true }));

//         try {
//             const response = await axios.post(
//                 `${NODE_API}/assign/assign-mentee`,
//                 { menteeId: selectedMenteeId, mentorId: professorId },
//                 { withCredentials: true }
//             );

//             console.log("Assignment successful:", response.data);
//             alert("Professor assigned successfully!");
//         } catch (error) {
//             console.error("Error assigning professor:", error.response?.data || error.message);
//             alert("Failed to assign professor.");
//         } finally {
//             setAssigning((prev) => ({ ...prev, [professorId]: false }));
//         }
//     };

//     const formatScore = (score) => (score * 100).toFixed(2) + "%";

//     return (
//         <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">Professor Directory</h2>

//             {/* Mentee Selection Dropdown */}
//             <div className="mb-4">
//                 <label className="block text-lg font-medium text-gray-700">Select Mentee:</label>
//                 <select
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
//                     value={selectedMenteeId}
//                     onChange={(e) => setSelectedMenteeId(e.target.value)}
//                 >
//                     <option value="">-- Select a Mentee --</option>
//                     {mentees.map((mentee) => (
//                         <option key={mentee._id} value={mentee._id}>
//                             {mentee.name}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* Display Mentee Skills */}
//             {selectedMentee && (
//                 <div className="mb-4">
//                     <h3 className="text-lg font-semibold text-gray-700">Mentee Skills:</h3>
//                     {selectedMentee.skills.length > 0 ? (
//                         <ul className="list-disc pl-5 text-gray-600">
//                             {selectedMentee.skills.map((skill, index) => (
//                                 <li key={index}>{skill.name}</li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-gray-500">No skills listed.</p>
//                     )}
//                 </div>
//             )}

//             {loading ? (
//                 <div className="flex justify-center py-6">
//                     <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="w-full bg-white border border-gray-200 rounded-md">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-4 py-2 text-left">Name</th>
//                                 <th className="px-4 py-2 text-left">Email</th>
//                                 <th className="px-4 py-2 text-left">Match Score</th>
//                                 <th className="px-4 py-2 text-left">Skills</th>
//                                 <th className="px-4 py-2 text-left">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {professors.length > 0 ? (
//                                 professors.map((professor) => (
//                                     <tr key={professor._id} className="border-t border-gray-200 hover:bg-gray-50">
//                                         <td className="px-4 py-3 font-medium">{professor.name}</td>
//                                         <td className="px-4 py-3 text-blue-600">{professor.email}</td>
//                                         <td className="px-4 py-3">{formatScore(professor.similarity_score)}</td>
//                                         <td className="px-4 py-3">{professor.skills || "No skills listed"}</td>
//                                         <td className="px-4 py-3">
//                                             <button
//                                                 className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
//                                                 onClick={() => assignProfessor(professor._id)}
//                                                 disabled={assigning[professor._id] || !selectedMenteeId}
//                                             >
//                                                 {assigning[professor._id] ? "Assigning..." : "Assign"}
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-4">
//                                         No professors available for the selected mentee.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Similarity;

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import skillList from '../../data/skillList';

// Sample skills list
// const skillList = ['React', 'NodeJS', 'JavaScript', 'Python', 'CSS', 'Machine Learning'];

const Similarity = () => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [displayList, setDisplayList] = useState(false);
  const [mentees, setMentees] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Autocomplete states
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    
    const filtered = skillList.filter(skill => 
      skill.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [inputValue]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedSkill('');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSelectedSkill(suggestion);
    setShowSuggestions(false);
  };

  // Handle submit to get matching mentors and mentees
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkill && !inputValue) return;
    
    const skillToUse = selectedSkill || inputValue;
    
    setLoading(true);
    setDisplayList(false);
    setError('');

    try {
      // Make an API call using axios
      const response = await axios.post("http://127.0.0.1:5004/mentor-mentee/team", {
        "team": skillToUse
      }, { withCredentials: true });
      
      // Check if response.data is defined and has the expected structure
      if (response.data && response.data.Mentees && response.data.Mentors) {
        setMentees(response.data.Mentees);
        setMentors(response.data.Mentors);
        setDisplayList(true);
        setSelectedSkill(skillToUse); // Set the selected skill for display
      } else {
        setError('Invalid response structure from the API');
      }
    } catch (error) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">Mentor-Mentee Matching</h2>

      <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Enter a Skill:</h3>
        <div className="flex flex-col sm:flex-row gap-3 relative">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type a skill (e.g. React, Python)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onFocus={() => {
                if (filteredSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {showSuggestions && (
              <ul 
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className={`px-5 py-2 rounded-md text-white font-medium ${
              (!selectedSkill && !inputValue) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={!selectedSkill && !inputValue}
          >
            Find Matches
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {displayList && !loading && (
        <div className="mt-8">
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full mb-6">
            <span className="font-medium">Selected Skill: </span>
            <span className="font-bold">{selectedSkill}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border-t-4 border-red-500">
              <h3 className="text-lg font-medium p-4 border-b border-gray-200 text-gray-800">Mentees</h3>
              <ul>
                {mentees.length > 0 ? (
                  mentees.map((mentee, index) => (
                    <li key={index} className="p-4 border-b border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="font-semibold text-gray-800">{mentee.name}</div>
                      <div className="text-sm text-gray-500">{mentee.email}</div>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-gray-500">No mentees found</li>
                )}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border-t-4 border-green-500">
              <h3 className="text-lg font-medium p-4 border-b border-gray-200 text-gray-800">Mentors</h3>
              <ul>
                {mentors.length > 0 ? (
                  mentors.map((mentor, index) => (
                    <li key={index} className="p-4 border-b border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="font-semibold text-gray-800">{mentor.name}</div>
                      <div className="text-sm text-gray-500">{mentor.email}</div>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-gray-500">No mentors found</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Similarity;