import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FaMicrophone, FaSearch, FaSpinner } from "react-icons/fa";
import { axiosInstance } from "../lib/axios.js";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Speech Recognition Hooks
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Your browser does not support voice search.</span>;
  }

  // Handle Text Search
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

  // Handle Voice Search Start
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-US" });
  };

  // Auto-fill text input when speech recognition ends
  useEffect(() => {
    if (!listening && transcript) {
      setQuery(transcript);
    }
  }, [transcript, listening]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-500 text-center">SmartSearch</h1>
      <p className="text-gray-400 text-center">AI-powered search engine for smarter results</p>

      {/* Search Bar - Responsive */}
      <div className="flex items-center bg-gray-800 rounded-full px-4 sm:px-6 md:px-8 py-2 mt-6 w-full max-w-lg">
        <FaSearch className="text-gray-400 mr-2 sm:mr-3" />
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white text-sm sm:text-base"
        />
        <FaMicrophone
          className={`cursor-pointer ${listening ? "text-red-500 animate-pulse" : "text-blue-400 hover:text-blue-500"}`}
          onClick={startListening}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-2 sm:ml-3 bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full flex items-center"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Search"}
        </button>
      </div>

      {/* Listening Indicator */}
      {listening && <p className="mt-3 text-green-400">Listening...</p>}

      {/* Features Section (Added More Space) */}
      <div className="mt-32 w-full max-w-5xl px-4">
        <h2 className="text-2xl font-semibold text-center text-gray-300">Intelligent Search Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full mb-3">
              <FaSearch className="text-white text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI-Powered Results</h3>
            <p className="text-gray-400 text-sm">Get intelligent summaries and context-aware search results</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full mb-3">
              <FaMicrophone className="text-white text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-white">Voice Search</h3>
            <p className="text-gray-400 text-sm">Search hands-free with advanced voice recognition</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full mb-3">
              <span className="text-white text-lg">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Custom Preferences</h3>
            <p className="text-gray-400 text-sm">Personalize your search with site preferences and filters</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

