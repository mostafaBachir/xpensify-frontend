// src/store/serviceStore.js

import { create } from "zustand";
import {authApi as api} from "@/services/api";
import { persist } from "zustand/middleware";

const useServiceStore = create(
    persist(

    (set) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/auth/services");
      set({ services: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data || "Erreur de chargement", loading: false });
    }
  },

  addService: async (data) => {
    try {
      await api.post("/auth/services", data);
      await useServiceStore.getState().fetchServices();
    } catch (err) {
      throw err.response?.data || { error: "Erreur lors de l'ajout" };
    }
  },

  updateService: async (id, data) => {
    try {
      await api.put(`/auth/services/${id}`, data);
      await useServiceStore.getState().fetchServices();
    } catch (err) {
      throw err.response?.data || { error: "Erreur lors de la mise à jour" };
    }
  },

  deleteService: async (id) => {
    try {
      await api.delete(`/auth/services/${id}`);
      await useServiceStore.getState().fetchServices();
    } catch (err) {
      throw err.response?.data || { error: "Erreur lors de la suppression" };
    }
  },
})));

export default useServiceStore;
