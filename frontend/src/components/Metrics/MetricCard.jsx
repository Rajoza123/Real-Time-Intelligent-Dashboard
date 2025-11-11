export default function MetricCard({ label, value, sub }) {
  return (
    <div className="card card-hover p-4">
      <div className="kpi">{value}</div>
      <div className="kpi-label mt-1">{label}</div>
      {sub ? <div className="mt-2 text-xs text-neutral-400">{sub}</div> : null}
    </div>
  );
}
