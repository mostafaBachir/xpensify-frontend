// src/services/api.js

import axios from "axios";
import useAuthStore from "@/store/authStore";
import { jwtDecode } from "jwt-decode";

const URL_API = "http://localhost:8001/api";

const api = axios.create({
  baseURL: URL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : ajouter le token depuis Zustand
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Intercepteur de réponse : gérer les expirations de token via Zustand
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
        const { refreshToken, login, logout } = useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${URL_API}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = res.data;

        const decoded = jwtDecode(access_token);
        login(
          {
            id: decoded.user_id,
            email: decoded.email,
            role: decoded.role || "user",
          },
          access_token,
          newRefreshToken || refreshToken
        );

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
