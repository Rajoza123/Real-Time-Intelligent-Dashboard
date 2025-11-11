import { create } from "zustand";
import { fetchAlerts, fetchAbnormal } from "../api/alertsApi";

export const useAlertStore = create((set, get) => ({
  alerts: [],
  filteredAlerts: [],
  abnormal: [],
  filters: {
    cameraId: "",
    label: "",
    severity: ""
  },

  loadAlerts: async () => {
    const data = await fetchAlerts();
    set({ alerts: data });
    get().applyFilters();
  },

  loadAbnormal: async () => {
    const data = await fetchAbnormal();
    set({ abnormal: data });
  },

  setFilter: (key, value) => {
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({
      filters: { cameraId: "", label: "", severity: "" }
    });
    get().applyFilters();
  },

  applyFilters: () => {
    const { alerts, filters } = get();

    const rows = alerts.filter(a => {
      if (filters.cameraId && a.event.cameraId !== filters.cameraId)
        return false;
      if (filters.label && a.event.label !== filters.label)
        return false;
      if (filters.severity && a.severity !== filters.severity)
        return false;
      return true;
    });

    set({ filteredAlerts: rows });
  }
}));
