// 📁 store/userStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {authApi as api} from "@/services/api";

const useUserStore = create(
  persist(
    (set, get) => ({
      users: [],
      loading: false,
      error: null,

      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          const res = await api.get("/auth/users");
          set({ users: res.data, loading: false });
        } catch (error) {
          set({ error: "Erreur lors de la récupération des utilisateurs", loading: false });
        }
      },

      updateUserPermissions: async (userId, permissions) => {
        try {
          await api.put(`/auth/users/${userId}/permissions`, permissions);
          await get().fetchUsers();
        } catch (error) {
          set({ error: "Erreur lors de la mise à jour des permissions" });
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({ users: state.users }),
    }
  )
);

export default useUserStore;