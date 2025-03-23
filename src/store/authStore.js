// src/store/authStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {jwtDecode} from "jwt-decode";
import api from "@/services/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      permissions: [],

      login: (userData, accessToken, refreshToken = null) => {
        let permissions = [];
        try {
          const decoded = jwtDecode(accessToken);
          permissions = decoded.permissions || [];
          userData.id = decoded.user_id;
          userData.email = decoded.email;
        } catch (err) {
          console.error("Erreur de décodage du token:", err);
        }

        set({
          user: userData,
          accessToken,
          refreshToken,
          permissions,
          isAuthenticated: true,
        });
      },

      register: async (name, email, password) => {
        try {
          const res = await api.post("/auth/register", {
            name,
            email,
            password,
          });
          return res.data;
        } catch (error) {
          throw error.response?.data || { error: "Erreur lors de l'inscription" };
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          permissions: [],
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const state = get();
        const token = state.accessToken;
        const refresh = state.refreshToken;

        if (!token) return;

        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp && decoded.exp < now) {
            state.logout();
          }
        } catch (err) {
          console.error("Token invalide", err);
          state.logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);

export default useAuthStore;
