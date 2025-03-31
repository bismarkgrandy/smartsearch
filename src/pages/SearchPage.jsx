import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FaMicrophone, FaSearch, FaSpinner, FaExternalLinkAlt } from "react-icons/fa";
import { axiosInstance } from "../lib/axios.js";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(location.state?.query || "");
  const [loading, setLoading] = useState(false);
  const results = location.state?.results || { summary: "", results: [] };

  // Speech Recognition
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Your browser does not support voice search.</span>;
  }

  // Handle New Search
  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/search/search?query=${query}`);
      navigate("/search", { state: { results: response.data, query } });
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Start Voice Search
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-US" });
  };

  // Auto-fill search field with speech transcript
  useEffect(() => {
    if (!listening && transcript) {
      setQuery(transcript);
    }
  }, [transcript, listening]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col items-center p-4 md:p-6">
      {/* Logo and Search Bar */}
      <div className="w-full max-w-4xl mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">SmartSearch</h1>
        
        <div className="flex items-center w-full max-w-2xl shadow-lg rounded-full overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200">
          <div className="flex-1 flex items-center pl-4">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full py-3 bg-transparent outline-none text-gray-800 dark:text-white"
            />
          </div>
          
          <div className="flex items-center">
            <button
              onClick={startListening}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Voice search"
            >
              <FaMicrophone
                className={`${listening ? "text-red-500 animate-pulse" : "text-gray-500 dark:text-gray-400"}`}
                size={18}
              />
            </button>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-colors"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Search"}
            </button>
          </div>
        </div>
        
        {/* Listening Indicator */}
        {listening && (
          <div className="mt-2 text-green-600 dark:text-green-400 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Listening...
          </div>
        )}
      </div>

      {results.summary && (
        <div className="w-full max-w-4xl mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-blue-600 dark:text-blue-400">AI Overview</h2>
            </div>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">{results.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.results.length > 0 && (
        <div className="w-full max-w-4xl">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 px-4">
            {results.results.length} results found
          </div>
          
          <div className="space-y-6">
            {results.results.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium flex items-start"
                >
                  {item.title}
                  <FaExternalLinkAlt className="ml-2 text-gray-400 text-xs" />
                </a>
                <div className="text-green-700 dark:text-green-500 text-xs mt-1 mb-2">
                  {item.link?.length > 50 ? item.link.substring(0, 50) + '...' : item.link}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && results.results.length === 0 && !loading && (
        <div className="w-full max-w-4xl text-center py-10">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-medium mb-2">No results found for "{query}"</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
