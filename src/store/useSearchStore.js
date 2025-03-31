import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useSearchStore = create((set) => ({
  query: '',
  results: [],
  loading: false,
  error: null,

  setQuery: (newQuery) => set({ query: newQuery }),

  fetchSearchResults: async (query) => {
    if (!query) return; // Prevent empty searches
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get(`/search/search?query=${query}`);
      set({ results: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch search results', loading: false });
    }
  }
}));

