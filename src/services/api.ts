import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for image generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Art generation API
export const artAPI = {
  generateArt: async (data: {
    emotion?: string;
    description?: string;
    focusWord?: string;
    style?: string;
  }) => {
    const response = await api.post('/art/generate', data);
    return response.data;
  },

  getStatus: async (requestId: string) => {
    const response = await api.get(`/art/status/${requestId}`);
    return response.data;
  },
};

// Mood journal API
export const moodAPI = {
  saveEntry: async (data: {
    emotion: string;
    description?: string;
    intensity?: number;
    notes?: string;
  }) => {
    const response = await api.post('/mood/journal', data);
    return response.data;
  },

  getHistory: async (params?: {
    limit?: number;
    offset?: number;
  }) => {
    const response = await api.get('/mood/journal', { params });
    return response.data;
  },

  getAnalytics: async (period?: string) => {
    const response = await api.get('/mood/analytics', { 
      params: { period } 
    });
    return response.data;
  },
};

// Gallery API
export const galleryAPI = {
  getGallery: async (params?: {
    limit?: number;
    offset?: number;
    emotion?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  saveArtwork: async (data: {
    imageUrl: string;
    prompt: string;
    emotion?: string;
    metadata?: any;
  }) => {
    const response = await api.post('/gallery', data);
    return response.data;
  },

  deleteArtwork: async (artworkId: string) => {
    const response = await api.delete(`/gallery/${artworkId}`);
    return response.data;
  },

  getArtworkDetails: async (artworkId: string) => {
    const response = await api.get(`/gallery/${artworkId}`);
    return response.data;
  },

  toggleFavorite: async (artworkId: string) => {
    const response = await api.patch(`/gallery/${artworkId}/favorite`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
