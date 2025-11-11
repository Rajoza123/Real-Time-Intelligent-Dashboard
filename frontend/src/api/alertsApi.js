import axios from "axios";

const BASE = "https://real-time-intelligent-dashboard.onrender.com/api";

export const fetchAlerts = async () => {
  const res = await axios.get(`${BASE}/alerts?limit=500`);
  return res.data.alerts;
};

export const fetchAbnormal = async () => {
  const res = await axios.get(`${BASE}/abnormal`);
  return res.data.results;
};
