import { create } from "zustand";
import dayjs from "dayjs";
import { fetchAlerts, fetchAbnormal, fetchHealth } from "../lib/api";

const severities = ["Critical", "Moderate", "Low"];

export const useAlertStore = create((set, get) => ({
  loading: false,
  alerts: [],
  abnormal: [],
  health: null,

  // filters
  filters: {
    cameraId: "",
    label: "",
    severity: "",
    search: "",   // fuzzy on label/cameraId
    limit: 300,   // you asked for “all”; use a high number to avoid huge payloads
  },

  setFilter(key, value) {
    set(state => ({ filters: { ...state.filters, [key]: value } }));
  },
  resetFilters() {
    set({ filters: { cameraId: "", label: "", severity: "", search: "", limit: 300 } });
  },

  async loadHealth() {
    const data = await fetchHealth();
    set({ health: data });
  },

  async loadAlerts() {
    const { filters } = get();
    set({ loading: true });
    const params = {
      ...(filters.cameraId && { cameraId: filters.cameraId }),
      ...(filters.label && { label: filters.label }),
      ...(filters.severity && { severity: filters.severity }),
      ...(filters.limit && { limit: filters.limit }),
    };
    const data = await fetchAlerts(params);
    let rows = data.alerts || [];

    // client-side fuzzy search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      rows = rows.filter(r =>
        r.event.cameraId.toLowerCase().includes(q) ||
        r.event.label.toLowerCase().includes(q)
      );
    }

    set({ alerts: rows, loading: false });
  },

  async loadAbnormal() {
    const data = await fetchAbnormal();
    set({ abnormal: data.results || [] });
  },
}));
