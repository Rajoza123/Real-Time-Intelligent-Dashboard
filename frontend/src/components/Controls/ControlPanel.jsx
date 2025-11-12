import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function ControlPanel() {
  const [loading, setLoading] = useState(false);
  const [intervalMs, setIntervalMs] = useState(700);
  const [burstChance, setBurstChance] = useState(0.15);
  const [status, setStatus] = useState("Unknown");

  const callApi = async (endpoint, data = {}) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/controls/${endpoint}`, data);
      setStatus(res.data.generator.running ? "Running" : "Stopped");
    } catch (err) {
      console.error(err);
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">⚙️ Generator Controls</h2>

      <div className="flex flex-wrap gap-3 mb-3">
        <button
          onClick={() => callApi("start")}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Start
        </button>
        <button
          onClick={() => callApi("stop")}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Stop
        </button>
        <button
          onClick={() => callApi("reset")}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label>
          Interval (ms):{" "}
          <input
            type="number"
            className="text-black px-2 py-1 rounded"
            value={intervalMs}
            onChange={(e) => setIntervalMs(e.target.value)}
          />
        </label>
        <label>
          Burst Chance (0–1):{" "}
          <input
            type="number"
            step="0.05"
            className="text-black px-2 py-1 rounded"
            value={burstChance}
            onChange={(e) => setBurstChance(e.target.value)}
          />
        </label>
        <button
          onClick={() => callApi("options", { intervalMs: Number(intervalMs), burstChance: Number(burstChance) })}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Apply Settings
        </button>
      </div>

      <div className="mt-3 text-sm opacity-80">Status: {status}</div>
    </div>
  );
}
