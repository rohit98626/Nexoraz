import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response;
  },
};

export default authService;