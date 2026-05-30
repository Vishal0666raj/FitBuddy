import axios from 'axios';
import { logout } from '../features/auth/authSlice';


console.log("API URL =", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5003/api',
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('forge:token');

  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
