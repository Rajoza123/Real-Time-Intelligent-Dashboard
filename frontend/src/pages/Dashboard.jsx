import { useEffect, useMemo, useState } from "react";
import { useAlertStore } from "../store/alertStore";
import MetricsRow from "../components/Metrics/MetricsRow";
import AlertsList from "../components/Alerts/AlertsList";
import AbnormalPanel from "../components/Abnormal/AbnormalPanel";
import FiltersBar from "../components/Filters/FiltersBar";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const { loadAlerts, loadAbnormal, loadHealth, alerts } = useAlertStore();
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // derive dropdown values
  const cams = useMemo(() => [...new Set(alerts.map(a => a.event.cameraId))].sort(), [alerts]);
  const labels = useMemo(() => [...new Set(alerts.map(a => a.event.label))].sort(), [alerts]);

  const fetchHealth = async () => {
    try {
      const res = await axios.get(`${API}/health`);
      setRunning(res.data.generator.running);
    } catch {
      setRunning(false);
    }
  };

  const toggleGenerator = async (action) => {
    setLoading(true);
    try {
      await axios.post(`${API}/controls/${action}`);
      await fetchHealth();
      setMessage(action === "start" ? "Event generator started." : "Event generator stopped.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to control generator.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const resetDashboard = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/controls/reset`);
      setMessage("Dashboard reset successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to reset dashboard.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  useEffect(() => {
    loadHealth();
    loadAlerts();
    loadAbnormal();
    fetchHealth();

    const id = setInterval(() => {
      loadAlerts();
      loadAbnormal();
    }, 1500);
    return () => clearInterval(id);
  }, [loadAlerts, loadAbnormal, loadHealth]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 text-white">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-white">
            Real-Time Intelligent Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Status:{" "}
            <span
              className={`font-semibold ${
                running ? "text-green-400" : "text-red-400"
              }`}
            >
              {running ? "Running" : "Stopped"}
            </span>
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 mt-2 md:mt-0">
          {!running ? (
            <button
              onClick={() => toggleGenerator("start")}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded shadow-md transition-all"
            >
              ▶️ Start
            </button>
          ) : (
            <button
              onClick={() => toggleGenerator("stop")}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded shadow-md transition-all"
            >
              ⏹ Stop
            </button>
          )}

          <button
            onClick={resetDashboard}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded shadow-md transition-all"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className="bg-gray-800 text-sm text-center p-2 rounded-md text-blue-300">
          {message}
        </div>
      )}

      {/* Filters + Metrics */}
      <FiltersBar cameras={cams} labels={labels} onRefresh={loadAlerts} />
      <MetricsRow alerts={alerts} />

      {/* Alerts + Abnormal Sections */}
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
