import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL; // must end with /api

export default function Dashboard() {
  // app state
  const [alerts, setAlerts] = useState([]);
  const [abnormal, setAbnormal] = useState([]);
  const [running, setRunning] = useState(false);
  const [loadingControls, setLoadingControls] = useState(false);
  const [error, setError] = useState(null);

  // filters
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [windowMin, setWindowMin] = useState(5); // default time window in minutes

  // polling interval (ms)
  const POLL_MS = 1500;

  // ------- API calls -------
  const fetchHealth = async () => {
    try {
      const res = await axios.get(`${API}/health`);
      setRunning(Boolean(res.data?.generator?.running));
      setError(null);
    } catch (err) {
      console.error("health error", err);
      setRunning(false);
      setError("Backend unreachable");
    }
  };

  const fetchAlerts = async () => {
    try {
      // build query
      const q = new URLSearchParams();
      q.set("windowMin", String(windowMin));
      if (selectedCamera) q.set("cameraId", selectedCamera);
      if (selectedLabel) q.set("label", selectedLabel);
      if (selectedSeverity) q.set("severity", selectedSeverity);

      const res = await axios.get(`${API}/alerts?${q.toString()}`);
      setAlerts(Array.isArray(res.data.alerts) ? res.data.alerts : []);
      setError(null);
    } catch (err) {
      console.error("alerts error", err);
      setAlerts([]);
      setError("Failed to load alerts");
    }
  };

  const fetchAbnormal = async () => {
    try {
      const res = await axios.get(`${API}/abnormal?windowMin=${windowMin}`);
      setAbnormal(Array.isArray(res.data.results) ? res.data.results : []);
      setError(null);
    } catch (err) {
      console.error("abnormal error", err);
      setAbnormal([]);
    }
  };

  const startGenerator = async () => {
    setLoadingControls(true);
    try {
      await axios.post(`${API}/controls/start`);
      await fetchHealth();
    } catch (err) {
      console.error(err);
      setError("Failed to start generator");
    } finally {
      setLoadingControls(false);
    }
  };

  const stopGenerator = async () => {
    setLoadingControls(true);
    try {
      await axios.post(`${API}/controls/stop`);
      await fetchHealth();
    } catch (err) {
      console.error(err);
      setError("Failed to stop generator");
    } finally {
      setLoadingControls(false);
    }
  };

  const resetDashboard = async () => {
    setLoadingControls(true);
    try {
      await axios.post(`${API}/controls/reset`);
      // clear local view immediately
      setAlerts([]);
      setAbnormal([]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to reset dashboard");
    } finally {
      setLoadingControls(false);
    }
  };

  // ------- derived lists for filters -------
  const cameras = useMemo(() => {
    const s = new Set(alerts.map((a) => a.event.cameraId));
    return Array.from(s).sort();
  }, [alerts]);

  const labels = useMemo(() => {
    const s = new Set(alerts.map((a) => a.event.label));
    return Array.from(s).sort();
  }, [alerts]);

  // metrics counts
  const metrics = useMemo(() => {
    const counts = { Critical: 0, Moderate: 0, Low: 0, total: 0 };
    for (const a of alerts) {
      const sev = a.severity || a.severity?.toString() || "Low";
      counts[sev] = (counts[sev] || 0) + 1;
      counts.total += 1;
    }
    return counts;
  }, [alerts]);

  // initial load and polling
  useEffect(() => {
    // initial
    fetchHealth();
    fetchAlerts();
    fetchAbnormal();

    // polling
    const id = setInterval(() => {
      fetchAlerts();
      fetchAbnormal();
    }, POLL_MS);

    return () => clearInterval(id);
  }, [selectedCamera, selectedLabel, selectedSeverity, windowMin]); // refetch when filters/windown change

  // ------- small helper formatting -------
  const fmtTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString();
    } catch {
      return iso;
    }
  };

  // UI
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Real-Time Intelligent Dashboard</h1>
          <p className="text-sm text-gray-300">
            Status:{" "}
            <span className={running ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
              {running ? "Running" : "Stopped"}
            </span>
            {error ? <span className="text-yellow-300 ml-3"> — {error}</span> : null}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {running ? (
            <button
              onClick={stopGenerator}
              disabled={loadingControls}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
            >
              ⏹ Stop
            </button>
          ) : (
            <button
              onClick={startGenerator}
              disabled={loadingControls}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded"
            >
              ▶️ Start
            </button>
          )}
          <button
            onClick={resetDashboard}
            disabled={loadingControls}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/70 p-3 rounded-md border border-gray-700 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Window (min)</label>
          <select
            value={windowMin}
            onChange={(e) => setWindowMin(Number(e.target.value))}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            <option value="">All</option>
            {cameras.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Label</label>
          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            <option value="">All</option>
            {labels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Severity</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            <option value="">All</option>
            <option value="Critical">Critical</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="ml-auto">
          <button
            onClick={() => {
              fetchAlerts();
              fetchAbnormal();
            }}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard title="Critical" value={metrics.Critical} color="red" />
        <MetricCard title="Moderate" value={metrics.Moderate} color="yellow" />
        <MetricCard title="Low" value={metrics.Low} color="green" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <section className="bg-gray-900/70 p-3 rounded-md border border-gray-700">
            <h3 className="font-semibold mb-2">Alerts ({alerts.length})</h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {alerts.length === 0 ? (
                <div className="text-sm text-gray-400">No alerts in selected window.</div>
              ) : (
                alerts.map((a) => <AlertRow key={a.event.id} alert={a} fmtTime={fmtTime} />)
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <section className="bg-gray-900/70 p-3 rounded-md border border-gray-700">
            <h3 className="font-semibold mb-2">Abnormal Cameras</h3>
            {abnormal.length === 0 ? (
              <div className="text-sm text-gray-400">No abnormal activity detected.</div>
            ) : (
              abnormal.map((b) => (
                <div key={b.cameraId} className="p-2 border-b border-gray-800">
                  <div className="flex justify-between">
                    <div className="font-medium">{b.cameraId}</div>
                    <div className="text-sm text-gray-300">{b.count}</div>
                  </div>
                  <div className="text-xs text-gray-400">Window {b.windowMin} min</div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Small sub-components ----------------- */
function MetricCard({ title, value = 0, color }) {
  const colorClass =
    color === "red" ? "text-red-400" : color === "yellow" ? "text-yellow-400" : "text-green-400";
  return (
    <div className="bg-gray-900/70 p-4 rounded-md border border-gray-700 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-300">{title}</div>
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      </div>
      <div className="text-sm text-gray-500">Live</div>
    </div>
  );
}

function AlertRow({ alert, fmtTime }) {
  const { event, severity, score, freqInWindow } = alert;
  const sevClass =
    severity === "Critical" ? "bg-red-600" : severity === "Moderate" ? "bg-yellow-500" : "bg-green-600";
  return (
    <div className="p-2 bg-gray-800/60 rounded flex items-start gap-3">
      <div className={`px-2 py-1 rounded text-white text-xs ${sevClass} w-20 text-center`}>
        {severity}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{event.label} — {event.cameraId}</div>
            <div className="text-xs text-gray-400">conf: {Number(event.confidence).toFixed(2)} • score: {score}</div>
          </div>
          <div className="text-xs text-gray-400">{fmtTime(event.timestamp)}</div>
        </div>
        <div className="text-xs text-gray-400 mt-1">freq:{freqInWindow}</div>
      </div>
    </div>
  );
}
