export default function MetricCard({ label, value, color }) {
  return (
    <div className={`${color} p-4 rounded-xl text-center font-bold`}>
      {label}: {value}
    </div>
  );
}
