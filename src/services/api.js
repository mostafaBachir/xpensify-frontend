// src/services/api.js

import axios from "axios";
import useAuthStore from "@/store/authStore";
import {jwtDecode} from "jwt-decode";

const URL_API = "http://localhost:8001/api" 

const api = axios.create({
  baseURL: URL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : gérer les expirations de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("http://localhost:8001/api/auth/refresh", {
          refresh_token: refreshToken,
        });

        const { access_token } = res.data;
        localStorage.setItem("auth_token", access_token);

        const decoded = jwtDecode(access_token);
        useAuthStore.getState().login({
          id: decoded.user_id,
          email: decoded.email,
        }, access_token, refreshToken);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
