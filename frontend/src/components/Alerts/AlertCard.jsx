import SeverityBadge from "./SeverityBadge";

export default function AlertCard({ a }) {
  const e = a.event;

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl mb-3 shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{e.label}</h3>
        <SeverityBadge severity={a.severity} />
      </div>

      <p className="text-gray-400 text-sm">Camera: {e.cameraId}</p>
      <p className="text-gray-400 text-sm">Confidence: {e.confidence}</p>
      <p className="text-gray-600 text-xs mt-1">{e.timestamp}</p>
    </div>
  );
}
