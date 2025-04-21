import React, { useState, useRef } from 'react';
import axios from 'axios';

const PDFChatComponent = () => {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const fileInputRef = useRef(null);
  const FLASK_API = import.meta.env.VITE_FLASK_API;

  const handleFileChange = (e) => {
    // Convert FileList to Array and filter PDF files
    const selectedFiles = Array.from(e.target.files).filter(
      (file) => file.type === 'application/pdf'
    );
    setFiles(selectedFiles);
    setUploadStatus('');
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (files.length === 0) {
      setUploadStatus('Please select PDF file(s) first');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('pdfs', file);
    });

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${FLASK_API}/chatpdf/process_pdfs`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUploadStatus(`${files.length} PDF(s) uploaded successfully`);
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!question) {
      setResponseText('Please enter a question');
      return;
    }

    setIsLoading2(true);
    try {
      const response = await axios.post(
        `${FLASK_API}/chatpdf/ask`,
        { question }
      );
      setResponseText(response.data.reply);
    } catch (error) {
      setResponseText('Failed to get response: ' + error.message);
    } finally {
      setIsLoading2(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="h-11/12 bg-gradient-to-br from-blue-50 to-blue-100 flex md:items-center my-6 md:my-0 items-start justify-center p-2 sm:p-4 mx-2">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 sm:p-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3 text-blue-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            QueryPDF
          </h3>
        </div>
  
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-500">
            <div className="mb-4">
              <label
                htmlFor="pdf-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload PDFs
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="
                    w-full sm:w-auto
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-100 file:text-blue-700
                    hover:file:bg-blue-200
                    text-sm text-gray-500
                  "
                />
                <div className="flex items-center space-x-2">
                  {files.length > 0 && (
                    <button
                      onClick={clearFiles}
                      className="
                        text-red-500 
                        hover:text-red-700 
                        hover:bg-red-50 
                        rounded-full 
                        p-2 
                        transition duration-300
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isLoading}
                    className="
                      w-full sm:w-auto
                      px-4 sm:px-6 py-2 
                      bg-blue-600 text-white 
                      rounded-full 
                      hover:bg-blue-700 
                      disabled:bg-gray-300
                      transition duration-300
                      flex items-center justify-center space-x-2
                      shadow-md hover:shadow-lg
                    "
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-sm sm:text-base">Uploading...</span>
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                </div>
              </div>
  
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="
                        flex items-center justify-between 
                        bg-white 
                        p-2 
                        rounded-lg 
                        shadow-sm
                        border border-blue-100
                      "
                    >
                      <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[60%] sm:max-w-[70%]">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(file)}
                        className="
                          text-red-500 
                          hover:text-red-700 
                          hover:bg-red-50 
                          rounded-full 
                          p-1 
                          transition duration-300
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
  
              {uploadStatus && (
                <p
                  className={`mt-2 text-xs sm:text-sm 
                  flex items-center
                  ${uploadStatus.includes('failed')
                    ? 'text-red-600'
                    : 'text-green-600'}`}
                >
                  {uploadStatus.includes('failed') ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {uploadStatus}
                </p>
              )}
            </div>
  
            <div className="mt-4 sm:mt-6">
              <label
                htmlFor="question-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ask a Question about the PDF(s)
              </label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  id="question-input"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is the main topic of the PDF(s)?"
                  className="
                    flex-grow 
                    px-3 sm:px-4 py-2 
                    border border-gray-300 
                    rounded-lg 
                    focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent
                    transition duration-300
                    text-sm sm:text-base
                  "
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!question || isLoading}
                  className="
                    px-4 sm:px-6 py-2 
                    bg-blue-600 text-white 
                    rounded-full 
                    hover:bg-blue-700 
                    disabled:bg-gray-300
                    transition duration-300
                    flex items-center justify-center space-x-2
                    shadow-md hover:shadow-lg
                  "
                >
                  {isLoading2 ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-sm sm:text-base">Processing...</span>
                    </>
                  ) : (
                    'Ask'
                  )}
                </button>
              </div>
            </div>
          </div>
  
          {responseText && (
            <div
              className="
              bg-gradient-to-r from-blue-50 to-blue-100
              p-4 sm:p-5 
              rounded-lg 
              border-l-4 
              border-blue-500
              shadow-md
              animate-fade-in
            "
            >
              <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-2 sm:mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                PDF Response
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{responseText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFChatComponent;
