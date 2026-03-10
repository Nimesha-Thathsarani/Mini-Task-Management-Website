import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && token !== 'undefined') {
      config.headers.set('Authorization', `Bearer ${token}`);
      // Fallback for older axios versions just in case:
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token', { path: '/' });
      Cookies.remove('user', { path: '/' });
      if (typeof window !== 'undefined') {
          window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
