import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds timeout for AI analysis
});

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. The analysis is taking longer than expected. Please try again with smaller files or check your internet connection.'));
    } else if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error('An unexpected error occurred.'));
    }
  }
);

// API functions
export const apiService = {
  // Analyze documents
  analyzeDocuments: async (tenderFile, proposalFile) => {
    const formData = new FormData();
    formData.append('tender', tenderFile);
    formData.append('proposal', proposalFile);

    const response = await api.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for document analysis
    });

    return response.data;
  },

  // Chat with AI
  chat: async (message, context) => {
    const response = await api.post('/api/chat', {
      message,
      context,
    });

    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

export default apiService; 