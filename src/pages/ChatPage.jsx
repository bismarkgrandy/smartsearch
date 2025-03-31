import { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../lib/axios.js';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axiosInstance.get('/chat/history');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    // Create user message
    const userMessage = {
      role: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString(),
      _id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/chat', { text: inputMessage });
      
      // Handle the response format from your backend
      if (response.data?.reply) {
        // This matches your backend's { reply: "message" } format
        const botMessage = {
          role: 'bot',
          text: response.data.reply,
          timestamp: new Date().toISOString(),
          _id: `bot-${Date.now()}`
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        role: 'bot',
        text: error.response?.data?.error || 
             'Sorry, there was an error processing your request.',
        timestamp: new Date().toISOString(),
        _id: `error-${Date.now()}`
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of your component remains the same)
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-[#020617] rounded-lg shadow-xl overflow-hidden">
        {/* AI Assistant Header */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">AI Assistant</h1>
          <p className="text-gray-400 text-sm">Ask questions or have a conversation with the AI</p>
        </div>

        {/* Messages container with scrolling */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Start a conversation with the AI assistant</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message._id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'bot' && (
                  <div className="w-8 h-8 mr-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm7-4a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0zM10 11a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className={`
                  max-w-[75%] p-3 rounded-lg
                  ${message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-white rounded-bl-none'
                  }
                `}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="w-8 h-8 mr-2 flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm7-4a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0zM10 11a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-800 text-white p-3 rounded-lg rounded-bl-none max-w-[75%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message input form */}
        <div className="border-t border-gray-800 p-4">
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white border-0 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;