import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const CodeEditor = () => {
  const {user} = useUser();
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, world!");');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [codeError, setCodeError] = useState(null);
  const [activeTab, setActiveTab] = useState('output'); // 'output' or 'error'
  console.log(user?._id.toString())
  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = document.querySelector('.code-input');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [code]);

  const submitCode = async () => {
    setisSubmitting(true);
    setOutput('');
    setCodeError(null);

    try {
        await axios.post(
        "https://athenai-backendonly.onrender.com/api/coding/submit-code",
        { "source_code": code, "language": language, "user_id": user?._id.toString() },
        { withCredentials: true }
      );
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setisSubmitting(false);
    }
  };
  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setCodeError(null);

    try {
      const resp = await axios.post("https://athenai-backendonly.onrender.com/api/coding/", { "source_code": code, "language": language},{ withCredentials: true });
      setOutput(resp.data.output);
      setCodeError(resp.data.errors);
      
      // Automatically switch to errors tab if there are errors
      if (resp.data.errors && resp.data.errors.length > 0) {
        setActiveTab('error');
      } else {
        setActiveTab('output');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setActiveTab('output');
    } finally {
      setIsRunning(false);
    }
  };
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getLanguageIcon = (lang) => {
    switch (lang) {
      case 'javascript':
        return '󰌞';
      case 'python':
        return '󰌠';
      case 'java':
        return '󰬷';
      case 'cpp':
        return '󰙲';
      default:
        return '󰅪';
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang) {
      case 'javascript':
        return 'bg-yellow-500';
      case 'python':
        return 'bg-blue-500';
      case 'java':
        return 'bg-orange-500';
      case 'cpp':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const hasErrors = codeError && (Array.isArray(codeError) ? codeError.length > 0 : true);

  return (
    <div className={`mx-5 mb-5 flex flex-col min-h-screen rounded-lg overflow-y-auto shadow-xl ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 gap-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex items-center space-x-2">
          <span className="text-xl">⌨️</span>
          <h2 className="text-lg font-semibold">Code Playground</h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
          {/* Language selector */}
          <div className="relative group">
            <div className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 border border-gray-300'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${getLanguageColor(language)}`}></div>
              <span className="text-sm font-medium">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            {/* Dropdown menu */}
            <div className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200'} hidden group-hover:block`}>
              <div className="py-1">
                {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center ${language === lang ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100') : ''} ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${getLanguageColor(lang)}`}></div>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700 bg-white' : 'hover:bg-gray-200 bg-black'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`px-3 sm:px-4 py-2 rounded-md font-medium flex items-center space-x-1 transition transform hover:-translate-y-0.5 text-sm sm:text-base ${isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-white'}`}
            >
              <span>{isRunning ? '⏳' : '▶️'}</span>
              <span className="hidden xs:inline">{isRunning ? 'Running...' : 'Run Code'}</span>
              <span className="xs:hidden">Run</span>
            </button>
            <button
              onClick={submitCode}
              disabled={isSubmitting}
              className={`px-3 sm:px-4 py-2 rounded-md font-medium flex items-center space-x-1 transition transform hover:-translate-y-0.5 text-sm sm:text-base ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400 text-white'}`}
            >
              <span>{isSubmitting ? '⏳' : '▶️'}</span>
              <span className="hidden xs:inline">{isSubmitting ? 'Submitting...' : 'Submit Code'}</span>
              <span className="xs:hidden">Submit</span>
            </button>
          </div>
        </div>
      </div>
  
      {/* Main editor */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Code panel */}
        <div className={`flex flex-col flex-1 ${theme === 'dark' ? 'border-r border-gray-700' : 'border-r border-gray-200'} h-1/2 md:h-auto`}>
          <div className={`flex justify-between items-center px-4 py-2 ${theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'}`}>
            <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Code</h3>
            <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
              {`main.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}`}
            </span>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Line numbers */}
            <div className={`py-3 px-2 text-right select-none ${theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'} font-mono text-xs sm:text-sm w-8 sm:w-12 overflow-y-hidden`}>
              {code.split('\n').map((_, idx) => (
                <div key={idx} className="leading-6">{idx + 1}</div>
              ))}
            </div>
            
            {/* Code input */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              className={`flex-1 p-2 sm:p-3 outline-none resize-none overflow-auto font-mono text-xs sm:text-sm tab-size-2 leading-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'} code-input`}
              spellCheck="false"
              wrap="off"
            />
          </div>
        </div>
  
        {/* Output/Error panel */}
        <div className="flex flex-col flex-1 h-1/2 md:h-auto">
          {/* Tab navigation */}
          <div className={`flex ${theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'}`}>
            <button 
              onClick={() => setActiveTab('output')} 
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 ${activeTab === 'output' 
                ? `${theme === 'dark' ? 'border-purple-500 text-purple-400' : 'border-purple-600 text-purple-600'}` 
                : `${theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700'}`
              }`}
            >
              Output
            </button>
            
            <button 
              onClick={() => setActiveTab('error')} 
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 flex items-center ${activeTab === 'error' 
                ? `${theme === 'dark' ? 'border-red-500 text-red-400' : 'border-red-600 text-red-600'}` 
                : `${theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700'}`
              }`}
            >
              Errors
              {hasErrors && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                  !
                </span>
              )}
            </button>
            
            <div className="flex-grow"></div>
            
            {isRunning && 
              <div className="text-xs px-2 py-1 my-1 mr-2 rounded bg-yellow-500 text-yellow-900 font-medium self-center">
                Running
              </div>
            }
            
            {!isRunning && output && activeTab === 'output' && 
              <div className="text-xs px-2 py-1 my-1 mr-2 rounded bg-green-500 text-green-900 font-medium self-center">
                Completed
              </div>
            }
            
            {!isRunning && hasErrors && activeTab === 'error' && 
              <div className="text-xs px-2 py-1 my-1 mr-2 rounded bg-red-500 text-red-900 font-medium self-center">
                Error
              </div>
            }
          </div>
          
          {/* Output content */}
          {activeTab === 'output' && (
            <pre className={`flex-1 p-3 sm:p-4 font-mono text-xs sm:text-sm leading-6 overflow-auto whitespace-pre-wrap ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
              {output || 'Run your code to see output here...'}
            </pre>
          )}
          
          {/* Error content */}
          {activeTab === 'error' && (
            <div className={`flex-1 p-3 sm:p-4 overflow-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
              {hasErrors ? (
                <div className="space-y-3">
                  {Array.isArray(codeError) ? (
                    codeError.map((err, idx) => (
                      <div key={idx} className={`p-2 sm:p-3 rounded-md ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                        <div className={`font-medium mb-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                          Error {idx + 1}:
                        </div>
                        <pre className={`font-mono text-xs sm:text-sm whitespace-pre-wrap ${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>
                          {typeof err === 'object' ? JSON.stringify(err, null, 2) : err}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <div className={`p-2 sm:p-3 rounded-md ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                      <div className={`font-medium mb-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                        Error:
                      </div>
                      <pre className={`font-mono text-xs sm:text-sm whitespace-pre-wrap ${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>
                        {typeof codeError === 'object' ? JSON.stringify(codeError, null, 2) : codeError}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  No errors to display. Your code is running smoothly! 🎉
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;