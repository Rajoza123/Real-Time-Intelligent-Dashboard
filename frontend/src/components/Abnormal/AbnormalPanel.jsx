import { useAlertStore } from "../../store/alertStore";

export default function AbnormalPanel() {
  const abnormal = useAlertStore((s) => s.abnormal);

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-3">Abnormal Activity</h2>

      {abnormal.length === 0 && (
        <p className="text-gray-400">No abnormal behaviour detected.</p>
      )}

      {abnormal.map((a) => (
        <div key={a.cameraId} className="border-b border-gray-700 py-3">
          <p>Camera: {a.cameraId}</p>
          <p>Events (last 2 min): {a.count}</p>
        </div>
      ))}
    </div>
  );
}
