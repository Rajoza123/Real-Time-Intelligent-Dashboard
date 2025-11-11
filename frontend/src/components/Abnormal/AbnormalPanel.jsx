import { useAlertStore } from "../../store/alertStore";

export default function AbnormalPanel() {
  const { abnormal } = useAlertStore();

  return (
    <div className="card card-hover p-4">
      <div className="mb-2 text-sm font-semibold">Abnormal Cameras</div>
      {!abnormal.length ? (
        <div className="text-xs text-neutral-400">No abnormal behavior in the recent window.</div>
      ) : (
        <ul className="space-y-2">
          {abnormal.map(x => (
            <li key={x.cameraId} className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2">
              <div className="font-mono text-sm">{x.cameraId}</div>
              <div className="text-xs text-neutral-300">
                {x.count} events / {x.windowMin} min (≥ {x.threshold})
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
