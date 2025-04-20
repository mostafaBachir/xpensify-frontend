// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { authApi as api } from '@/services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      permissions: [],

      login: async ({ email, password }) => {
        try {
          const res = await api.post("/auth/login/", { email, password });
          const { access_token, refresh_token } = res.data;

          let permissions = [];
          const userData = { email };

          try {
            const decoded = jwtDecode(access_token);
            permissions = decoded.permissions || [];
            userData.id = decoded.user_id;
            userData.email = decoded.email;
            userData.role = decoded.role || "user";
          } catch (err) {
            console.error("Erreur de décodage du token:", err);
          }

          set({
            user: userData,
            accessToken: access_token,
            refreshToken: refresh_token,
            permissions,
            isAuthenticated: true,
          });

          return { access_token, refresh_token };
        } catch (error) {
          throw error.response?.data || { error: "Échec de la connexion" };
        }
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

      me: async () => {
        try {
          const res = await api.get("/auth/me");
          const user = res.data;
          console.log(user)
          console.log("call on /me in authStore.js")
          const mappedPermissions = user.permissions.map((p) => ({
            service_id: p.service_id,
            service: p.service,
            action: p.permission,
          }));

          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            permissions: mappedPermissions,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Erreur lors du chargement du profil :", error);
        }
      },

      hasPermission: (service, action) => {
        const permissions = get().permissions;
        return permissions.some(
          (perm) => perm.service_id === service && perm.action === action
        );
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
