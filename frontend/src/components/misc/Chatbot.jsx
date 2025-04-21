import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Mic, VolumeX, Volume2, Maximize2, Minimize2, User, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Speech recognition implementation without the problematic dependency
function useSpeechRecognitionPolyfill() {
  // [Same code as before, no changes needed]
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const browserSupportsSpeechRecognition = typeof window !== 'undefined' && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptValue = result[0].transcript;
        setTranscript(transcriptValue);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () => {
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition: Boolean(browserSupportsSpeechRecognition)
  };
}

// Helper function to extract plain text from markdown for speech
function extractTextFromMarkdown(markdown) {
  // Simple regex replacements to handle common markdown elements
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/#{1,6}\s(.*?)(\n|$)/g, '$1') // Headers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/\n\d+\.\s+(.*?)(\n|$)/g, ' $1 ') // Numbered lists
    .replace(/\n[*-]\s+(.*?)(\n|$)/g, ' $1 '); // Bulleted lists
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const NODE_API = import.meta.env.VITE_NODE_API;
  
  const {
    transcript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognitionPolyfill();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }
    
    if (listening) {
      stopListening();
    } else {
      setInput('');
      resetTranscript();
      startListening();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (isSpeaking && !isMuted) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window && !isMuted) {
      // Convert markdown to plain text for speech
      const plainText = extractTextFromMarkdown(text);
      
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (listening) {
      stopListening();
    }
    
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { content: userMessage, role: 'user' }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${NODE_API}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      const botReply = data.reply;
      
      setMessages([...newMessages, { content: botReply, role: 'assistant' }]);
      
      if (isSpeaking) {
        speechSynthesis.cancel();
      }
      
      if (!isMuted) {
        speakMessage(botReply);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        content: "Sorry, I couldn't process your request. Please try again later.", 
        role: 'assistant' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
<>
  <motion.button 
    onClick={() => setIsOpen(true)} 
    className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-gradient-to-r from-blue-500 to-indigo-600 p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50"
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
  >
    <Bot className="h-5 w-5 md:h-6 md:w-6 text-white" />
  </motion.button>
  
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, y: 20, scale: 0.9 }} 
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed ${isExpanded ? 'bottom-0 right-0 left-0 top-0 md:bottom-4 md:right-4 md:left-4 md:top-4 max-w-full' : 'bottom-16 right-2 left-2 md:bottom-20 md:right-6 md:left-auto md:w-96'} bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 z-50`}
      >
        <div className="p-3 md:p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 md:h-5 md:w-5" />
            <h2 className="font-medium text-sm md:text-base">AI Assistant</h2>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <button 
              onClick={toggleMute}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button 
              onClick={toggleExpand}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className={`${isExpanded ? 'h-[calc(100%-8rem)]' : 'h-64 md:h-96'} overflow-y-auto p-3 md:p-4 bg-gray-50`}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-6 text-gray-400">
              <Bot className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 text-blue-400" />
              <p className="text-base md:text-lg font-medium text-gray-600">How can I help you today?</p>
              <p className="text-xs md:text-sm mt-2">Ask me anything you'd like to know.</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex my-2 md:my-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-200 mr-2'}`}>
                  {message.role === 'user' ? <User className="h-3 w-3 md:h-4 md:w-4 text-white" /> : <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />}
                </div>
                <div className={`p-2 md:p-3 rounded-2xl ${message.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800'} shadow-sm`}>
                  {message.role === 'user' ? (
                    <span className="text-sm md:text-base">{message.content}</span>
                  ) : (
                    <div className="markdown-content prose prose-xs md:prose-sm max-w-none text-sm md:text-base">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
          
          {isLoading && (
            <div className="flex justify-start my-2 md:my-3">
              <div className="flex">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-200 mr-2">
                  <Bot className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                </div>
                <div className="p-3 md:p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-2 md:p-4 bg-white border-t border-gray-100 flex space-x-2 items-center">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="flex-grow border border-gray-200 py-2 px-3 md:p-3 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 text-xs md:text-sm"
            placeholder={listening ? "Listening..." : "Type your message..."} 
          />
          {browserSupportsSpeechRecognition && (
            <button 
              type="button" 
              onClick={handleVoiceInput} 
              className={`p-2 md:p-3 rounded-full flex-shrink-0 transition-colors ${listening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Mic className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className={`p-2 md:p-3 rounded-full flex-shrink-0 transition-all duration-200 ${!input.trim() ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg'}`}
          >
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          
          {isSpeaking && (
            <button 
              type="button" 
              onClick={stopSpeaking} 
              className="bg-red-500 p-2 md:p-3 rounded-full text-white flex-shrink-0 hover:bg-red-600"
              title="Stop speaking"
            >
              <Square className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}
        </form>
      </motion.div>
    )}
  </AnimatePresence>
</>
  );
}