import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/,'') || "http://localhost:4000";

export const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 10000,
});

export const fetchAlerts = async (params = {}) => {
  const res = await api.get("/alerts", { params });
  return res.data;
};

export const fetchEvents = async (params = {}) => {
  const res = await api.get("/events", { params });
  return res.data;
};

export const fetchAbnormal = async (params = {}) => {
  const res = await api.get("/abnormal", { params });
  return res.data;
};

export const fetchHealth = async () => {
  const res = await api.get("/health");
  return res.data;
};
