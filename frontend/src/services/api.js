import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  getHealth: () => api.get('/health'),

  // Cities
  getCities: () => api.get('/cities'),
  getCityInfo: (cityName) => api.get(`/cities/${cityName}`),

  // Graph
  getGraphStats: () => api.get('/graph/stats'),

  // Routes
  findRoute: (start, goal, algorithm = 'astar') =>
    api.post('/route/find', { start, goal, algorithm }),

  compareAlgorithms: (start, goal, algorithms = null) =>
    api.post('/route/compare', { start, goal, algorithms }),

  // History
  getSearchHistory: (limit = 100, algorithm = null) => {
    const params = { limit };
    if (algorithm) params.algorithm = algorithm;
    return api.get('/history', { params });
  },

  // Algorithms
  getAvailableAlgorithms: () => api.get('/algorithms'),
};

export default apiService;
