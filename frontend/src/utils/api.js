import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for unified response handling
api.interceptors.response.use(
  response => {
    const { success, data } = response.data;
    if (success) {
      return data;
    }
    // This shouldn't happen for successful HTTP responses
    return Promise.reject(new Error(response.data.error || 'An error occurred'));
  },
  error => {
    // HTTP error responses (4xx, 5xx)
    const errorData = error.response?.data;
    const errorMessage = errorData?.error || errorData?.message || error.message || 'An error occurred';
    
    // Only redirect on 401 if user was authenticated
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password })
};

// Unified Quiz API (works for both admin and candidate based on JWT role)
export const quizAPI = {
  // Common endpoints
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  
  // Admin-only endpoints
  createQuiz: (data) => api.post('/quizzes', data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  getAnalytics: (id) => api.get(`/quizzes/${id}/analytics`),
  isQuizEditable: (id) => api.get(`/quizzes/${id}/editable`),
  isQuizDeletable: (id) => api.get(`/quizzes/${id}/deletable`),
  
  // Candidate endpoints
  startQuiz: (id) => api.post(`/quizzes/${id}/start`),
  submitQuiz: (data) => api.post('/quizzes/submit', data),
  
  // Attempts (filtered by role on backend)
  getAttempts: () => api.get('/quizzes/attempts'),
  getAttempt: (id) => api.get(`/quizzes/attempts/${id}`)
};

// Legacy APIs for backward compatibility (will be removed)
export const adminAPI = {
  getQuizzes: () => quizAPI.getQuizzes(),
  getQuiz: (id) => quizAPI.getQuiz(id),
  createQuiz: (data) => quizAPI.createQuiz(data),
  updateQuiz: (id, data) => quizAPI.updateQuiz(id, data),
  deleteQuiz: (id) => quizAPI.deleteQuiz(id),
  getAllAttempts: () => quizAPI.getAttempts()
};

export const candidateAPI = {
  getAvailableQuizzes: () => quizAPI.getQuizzes(),
  getQuiz: (id) => quizAPI.getQuiz(id),
  startQuiz: (id) => quizAPI.startQuiz(id),
  submitQuiz: (data) => quizAPI.submitQuiz(data),
  getMyAttempts: () => quizAPI.getAttempts(),
  getAttempt: (id) => quizAPI.getAttempt(id)
};
