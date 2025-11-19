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

// Response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password })
};

// Admin API
export const adminAPI = {
  getQuizzes: () => api.get('/admin/quizzes'),
  getQuiz: (id) => api.get(`/admin/quizzes/${id}`),
  createQuiz: (data) => api.post('/admin/quizzes', data),
  updateQuiz: (id, data) => api.put(`/admin/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
  getAllAttempts: () => api.get('/admin/quizzes/attempts/all')
};

// Candidate API
export const candidateAPI = {
  getAvailableQuizzes: () => api.get('/candidate/quizzes'),
  getQuiz: (id) => api.get(`/candidate/quizzes/${id}`),
  startQuiz: (id) => api.post(`/candidate/quizzes/${id}/start`),
  submitQuiz: (data) => api.post('/candidate/quizzes/submit', data),
  getMyAttempts: () => api.get('/candidate/quizzes/my-attempts'),
  getAttempt: (id) => api.get(`/candidate/quizzes/attempts/${id}`)
};
