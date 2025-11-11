import MetricCard from "./MetricCard";

export default function MetricsRow({ alerts }) {
  const total = alerts.length;
  const critical = alerts.filter(a => a.severity === "Critical").length;
  const moderate = alerts.filter(a => a.severity === "Moderate").length;
  const low = alerts.filter(a => a.severity === "Low").length;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <MetricCard label="Total Alerts" value={total} />
      <MetricCard label="Critical" value={critical} />
      <MetricCard label="Moderate" value={moderate} />
      <MetricCard label="Low" value={low} />
    </div>
  );
}
