import { useAlertStore } from "../../store/alertStore";

export default function FiltersBar({ cameras = [], labels = [], onRefresh }) {
  const { filters, setFilter, resetFilters } = useAlertStore();

  return (
    <div className="card card-hover p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <input
          className="input md:col-span-2"
          placeholder="Search (camera or label)…"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />

        <select
          className="select"
          value={filters.cameraId}
          onChange={(e) => setFilter("cameraId", e.target.value)}
        >
          <option value="">All Cameras</option>
          {cameras.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="select"
          value={filters.label}
          onChange={(e) => setFilter("label", e.target.value)}
        >
          <option value="">All Labels</option>
          {labels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <select
          className="select"
          value={filters.severity}
          onChange={(e) => setFilter("severity", e.target.value)}
        >
          <option value="">All Severity</option>
          <option>Critical</option>
          <option>Moderate</option>
          <option>Low</option>
        </select>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className="btn btn-primary" onClick={onRefresh}>Apply / Refresh</button>
        <button className="btn" onClick={resetFilters}>Reset</button>

        <div className="ml-auto">
          <span className="text-xs text-neutral-400">
            Tip: increase “limit” server-side if you truly want *all* alerts.
          </span>
        </div>
      </div>
    </div>
  );
}
