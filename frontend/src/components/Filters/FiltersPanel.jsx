import { useAlertStore } from "../../store/alertStore";

export default function FiltersPanel() {
  const { filters, setFilter, resetFilters } = useAlertStore();

  return (
    <div className="p-4 border-b border-gray-700 space-y-4">
      <h2 className="text-xl font-semibold">Filters</h2>

      <select
        className="w-full p-2 rounded bg-gray-900 border border-gray-700"
        value={filters.cameraId}
        onChange={e => setFilter("cameraId", e.target.value)}
      >
        <option value="">All Cameras</option>
        <option value="CAM-01">CAM-01</option>
        <option value="CAM-02">CAM-02</option>
        <option value="CAM-03">CAM-03</option>
        <option value="CAM-04">CAM-04</option>
        <option value="CAM-05">CAM-05</option>
      </select>

      <select
        className="w-full p-2 rounded bg-gray-900 border border-gray-700"
        value={filters.label}
        onChange={e => setFilter("label", e.target.value)}
      >
        <option value="">All Labels</option>
        <option value="Fire">Fire</option>
        <option value="Smoke">Smoke</option>
        <option value="Intrusion">Intrusion</option>
        <option value="Crowd">Crowd</option>
        <option value="Loitering">Loitering</option>
        <option value="Vehicle">Vehicle</option>
        <option value="Person">Person</option>
      </select>

      <select
        className="w-full p-2 rounded bg-gray-900 border border-gray-700"
        value={filters.severity}
        onChange={e => setFilter("severity", e.target.value)}
      >
        <option value="">All Severity</option>
        <option value="Critical">Critical</option>
        <option value="Moderate">Moderate</option>
        <option value="Low">Low</option>
      </select>

      <button
        onClick={resetFilters}
        className="w-full p-2 bg-red-700 hover:bg-red-800 rounded"
      >
        Reset Filters
      </button>
    </div>
  );
}
