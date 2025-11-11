import MetricCard from "./MetricCard";

export default function MetricsRow({ alerts }) {
  const critical = alerts.filter((a) => a.severity === "Critical").length;
  const moderate = alerts.filter((a) => a.severity === "Moderate").length;
  const low = alerts.filter((a) => a.severity === "Low").length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <MetricCard label="Critical" value={critical} color="bg-red-800" />
      <MetricCard label="Moderate" value={moderate} color="bg-yellow-800" />
      <MetricCard label="Low" value={low} color="bg-green-800" />
    </div>
  );
}
