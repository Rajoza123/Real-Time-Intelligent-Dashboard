import { create } from "zustand";
import { fetchAlerts, fetchAbnormal } from "../api/alertsApi";

export const useAlertStore = create((set) => ({
  alerts: [],
  abnormal: [],
  loading: false,

  loadAlerts: async () => {
    set({ loading: true });
    const data = await fetchAlerts();
    set({ alerts: data, loading: false });
  },

  loadAbnormal: async () => {
    const data = await fetchAbnormal();
    set({ abnormal: data });
  },
}));
