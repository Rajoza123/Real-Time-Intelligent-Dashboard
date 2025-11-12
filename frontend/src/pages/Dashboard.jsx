import { useEffect, useMemo } from "react";
import { useAlertStore } from "../store/alertStore";
import axios from "axios";

import MetricsRow from "../components/Metrics/MetricsRow";
import AlertsList from "../components/Alerts/AlertsList";
import AbnormalPanel from "../components/Abnormal/AbnormalPanel";
import FiltersBar from "../components/Filters/FiltersBar";
import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const { loadAlerts, loadAbnormal, loadHealth, alerts } = useAlertStore();
  const [status, setStatus] = useState("Unknown");
  const [intervalMs, setIntervalMs] = useState(700);
  const [burstChance, setBurstChance] = useState(0.15);
  const [loading, setLoading] = useState(false);

  // fetch generator status
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API}/health`);
      setStatus(res.data.generator.running ? "Running" : "Stopped");
    } catch {
      setStatus("Error");
    }
  };

  // send control command
  const send = async (path, data = {}) => {
    setLoading(true);
    try {
      await axios.post(`${API}/controls/${path}`, data);
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // derive distinct cameras and labels for filter dropdowns
  const cams = useMemo(() => {
    const s = new Set(alerts.map(a => a.event.cameraId));
    return Array.from(s).sort();
  }, [alerts]);

  const labels = useMemo(() => {
    const s = new Set(alerts.map(a => a.event.label));
    return Array.from(s).sort();
  }, [alerts]);

  useEffect(() => {
    // initial pulls
    loadHealth();
    loadAlerts();
    loadAbnormal();
    fetchStatus();

    // polling every 1.5s
    const id = setInterval(() => {
      loadAlerts();
      loadAbnormal();
    }, 1500);

    return () => clearInterval(id);
  }, [loadAlerts, loadAbnormal, loadHealth]); // include deps to silence eslint

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 text-white">
      <h1 className="text-3xl font-bold mb-2 text-white">
        Real-Time Intelligent Dashboard
      </h1>

      {/* ⚙️ Control Panel Section */}
<div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-lg shadow border border-gray-700">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-semibold">Generator Controls</h2>
      <span
        className={`text-sm font-medium px-3 py-1 rounded ${
          status === "Running"
            ? "bg-green-600 text-white"
            : status === "Stopped"
            ? "bg-red-600 text-white"
            : "bg-gray-600 text-gray-200"
        }`}
      >
        {status === "Error" ? "Offline" : status}
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => send("start")}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded transition"
      >
        Start
      </button>
      <button
        onClick={() => send("stop")}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition"
      >
        Stop
      </button>
      <button
        onClick={() => send("reset")}
        disabled={loading}
        className="bg-gray-700 hover:bg-gray-800 px-3 py-1.5 rounded transition"
      >
        Reset
      </button>
    </div>
  </div>

  <div className="flex flex-wrap items-center gap-4 mt-3">
    <label className="text-sm">
      Interval (ms):
      <input
        type="number"
        value={intervalMs}
        onChange={(e) => setIntervalMs(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 ml-2 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>

    <label className="text-sm">
      Burst Chance:
      <input
        type="number"
        step="0.05"
        min="0"
        max="1"
        value={burstChance}
        onChange={(e) => setBurstChance(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 ml-2 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>

    <button
      onClick={() =>
        send("options", {
          intervalMs: Number(intervalMs),
          burstChance: Number(burstChance),
        })
      }
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition"
    >
      Apply
    </button>
  </div>
</div>


      {/* 🔽 Existing sections */}
      <FiltersBar cameras={cams} labels={labels} onRefresh={loadAlerts} />
      <MetricsRow alerts={alerts} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertsList />
        </div>
        <div className="lg:col-span-1">
          <AbnormalPanel />
        </div>
      </div>
    </div>
  );
}
