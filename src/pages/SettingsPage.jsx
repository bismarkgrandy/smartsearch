import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  // State for all data
  const [searchHistory, setSearchHistory] = useState([]);
  const [blockedSites, setBlockedSites] = useState([]);
  const [preferredSites, setPreferredSites] = useState([]);
  const [newBlockedSite, setNewBlockedSite] = useState('');
  const [newPreferredSite, setNewPreferredSite] = useState('');

  // Fetch all data on component mount
  useEffect(() => {
    fetchSearchHistory();
    fetchWebsitePreferences();
  }, []);

  // Fetch search history
  const fetchSearchHistory = async () => {
    try {
      const response = await axiosInstance.get('/search/history?limit=20');
      // Check if the response has a history array
      if (response.data && Array.isArray(response.data.history)) {
        setSearchHistory(response.data.history);
      } else {
        setSearchHistory(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast.error(error.response?.data?.error || 'Failed to load search history');
    }
  };

  // Fetch website preferences (blocked and preferred sites)
  const fetchWebsitePreferences = async () => {
    try {
      const response = await axiosInstance.get('/website-preference');
      setBlockedSites(response.data.blockedWebsites || []);
      setPreferredSites(response.data.boostedWebsites || []);
    } catch (error) {
      console.error('Error fetching website preferences:', error);
      toast.error(error.response?.data?.error || 'Failed to load website preferences');
    }
  };

  // Clear all search history
  const clearSearchHistory = async () => {
    try {
      await axiosInstance.delete('/search/history/clear');
      setSearchHistory([]);
      // No success toast as requested
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast.error(error.response?.data?.error || 'Failed to clear search history');
    }
  };

  // Delete specific search history item
  const deleteSearchHistoryItem = async (id) => {
    try {
      await axiosInstance.delete(`/search/history/${id}`);
      fetchSearchHistory();
      // No success toast as requested
    } catch (error) {
      console.error('Error deleting search history item:', error);
      toast.error(error.response?.data?.error || 'Failed to delete search item');
    }
  };

  // Add blocked site
  const addBlockedSite = async (e) => {
    e.preventDefault();
    if (!newBlockedSite.trim()) return;
    
    try {
      await axiosInstance.post('/website-preference/blocked', {
        website: newBlockedSite
      });
      setNewBlockedSite('');
      fetchWebsitePreferences();
      // No success toast as requested
    } catch (error) {
      console.error('Error adding blocked site:', error);
      toast.error(error.response?.data?.error || 'Failed to add blocked site');
    }
  };

  // Remove blocked site
  const removeBlockedSite = async (website) => {
    try {
      await axiosInstance.delete('/website-preference/unblock', {
        data: { website: website } // Use 'data' property to send body with DELETE
      });
      fetchWebsitePreferences();
      // No success toast as requested
    } catch (error) {
      console.error('Error removing blocked site:', error);
      toast.error(error.response?.data?.error || 'Failed to remove blocked site');
    }
  };

  // Add preferred site
  const addPreferredSite = async (e) => {
    e.preventDefault();
    if (!newPreferredSite.trim()) return;
    
    try {
      await axiosInstance.post('/website-preference/boosted', {
        website: newPreferredSite
      });
      setNewPreferredSite('');
      fetchWebsitePreferences();
      // No success toast as requested
    } catch (error) {
      console.error('Error adding preferred site:', error);
      toast.error(error.response?.data?.error || 'Failed to add preferred site');
    }
  };

  // Remove preferred site
  const removePreferredSite = async (website) => {
    try {
      await axiosInstance.delete('/website-preference/unboost', {
        data: { website: website } // Use 'data' property to send body with DELETE
      });
      fetchWebsitePreferences();
      // No success toast as requested
    } catch (error) {
      console.error('Error removing preferred site:', error);
      toast.error(error.response?.data?.error || 'Failed to remove preferred site');
    }
  };

  // Format timestamp for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 mb-6 md:mb-8">Manage your search preferences and history</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Search History Section */}
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Search History</h2>
            <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-base">View and manage your search history</p>
            
            <div className="max-h-60 md:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 mb-4 pr-2">
              {searchHistory && searchHistory.length > 0 ? (
                <ul className="space-y-2">
                  {searchHistory.map((item) => (
                    <li key={item._id} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <div>
                        <div className="font-medium">{item.query}</div>
                        <div className="text-xs md:text-sm text-gray-400">{formatDate(item.timestamp)}</div>
                      </div>
                      <button
                        onClick={() => deleteSearchHistoryItem(item._id)}
                        className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                        aria-label="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 py-4">No search history</p>
              )}
            </div>

            <div className="flex justify-center md:justify-start">
              <button
                onClick={clearSearchHistory}
                className="flex items-center justify-center space-x-2 bg-red-800 hover:bg-red-700 text-white py-1.5 px-3 md:py-2 md:px-4 rounded text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Clear History</span>
              </button>
            </div>
          </div>

          {/* Blocked Sites Section */}
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Blocked Sites</h2>
            <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-base">Sites that won't appear in your search results</p>
            
            <form onSubmit={addBlockedSite} className="flex mb-4">
              <input
                type="text"
                placeholder="example.com"
                value={newBlockedSite}
                onChange={(e) => setNewBlockedSite(e.target.value)}
                className="flex-grow bg-gray-700 text-white px-3 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-r"
                aria-label="Add blocked site"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="max-h-60 md:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 pr-2">
              {blockedSites && blockedSites.length > 0 ? (
                <ul className="space-y-2">
                  {blockedSites.map((site, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="break-all mr-2">{site}</span>
                      <button
                        onClick={() => removeBlockedSite(site)}
                        className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                        aria-label="Unblock site"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 py-4">No blocked sites</p>
              )}
            </div>
          </div>

          {/* Preferred Sites Section */}
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 md:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Preferred Sites</h2>
            <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-base">Sites that will be boosted in your search results</p>
            
            <form onSubmit={addPreferredSite} className="flex mb-4">
              <input
                type="text"
                placeholder="example.com"
                value={newPreferredSite}
                onChange={(e) => setNewPreferredSite(e.target.value)}
                className="flex-grow bg-gray-700 text-white px-3 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-r"
                aria-label="Add preferred site"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="max-h-60 md:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 pr-2">
              {preferredSites && preferredSites.length > 0 ? (
                <ul className="space-y-2">
                  {preferredSites.map((site, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="break-all mr-2">{site}</span>
                      <button
                        onClick={() => removePreferredSite(site)}
                        className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                        aria-label="Remove preferred site"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 py-4">No preferred sites</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;