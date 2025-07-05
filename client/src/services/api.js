import axios from 'axios';

// Get API URL from environment or use a fallback
const getApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback logic for different environments
  if (process.env.NODE_ENV === 'production') {
    // In production, you need to set REACT_APP_API_URL environment variable
    console.warn('REACT_APP_API_URL not set in production. Please configure your backend URL.');
    return 'https://your-backend-domain.vercel.app'; // Replace with your actual backend URL
  }
  
  // Development fallback
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiUrl();

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds timeout for AI analysis
});

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
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
      if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        return Promise.reject(new Error(`Cannot connect to server at ${API_BASE_URL}. Please check if the backend server is running and the URL is correct.`));
      }
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