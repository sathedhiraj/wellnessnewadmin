/**
 * Centralized Axios instance for the Admin panel.
 * Uses NEXT_PUBLIC_API_URL from .env.local so you never hardcode localhost:5000.
 *
 * Usage:
 *   import api from '@/lib/api';
 *   const { data } = await api.get('/products');
 *   const { data } = await api.post('/products', { ... });
 */

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach JWT token if stored in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Optional: handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
