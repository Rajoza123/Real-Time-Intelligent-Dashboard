import { useEffect, useMemo } from "react";
import { useAlertStore } from "../store/alertStore";

import MetricsRow from "../components/Metrics/MetricsRow";
import AlertsList from "../components/Alerts/AlertsList";
import AbnormalPanel from "../components/Abnormal/AbnormalPanel";
import FiltersBar from "../components/Filters/FiltersBar";

export default function Dashboard() {
  const { loadAlerts, loadAbnormal, loadHealth, alerts } = useAlertStore();

  // derive distinct cameras and labels for filter dropdowns
  const cams = useMemo(() => {
    const s = new Set(alerts.map(a => a.event.cameraId));
    return Array.from(s).sort();
  }, [alerts]);
  const labels = useMemo(() => {
    const s = new Set(alerts.map(a => a.event.label));
    return Array.from(s).sort();
  }, [alerts]);

  useEffect(() => {
    // initial pulls
    loadHealth();
    loadAlerts();
    loadAbnormal();

    // polling every 1.5s
    const id = setInterval(() => {
      loadAlerts();
      loadAbnormal();
    }, 1500);

    return () => clearInterval(id);
  }, [loadAlerts, loadAbnormal, loadHealth]); // include deps to silence eslint

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4">
      <FiltersBar cameras={cams} labels={labels} onRefresh={loadAlerts} />
      <MetricsRow alerts={alerts} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertsList />
        </div>
        <div className="lg:col-span-1">
          <AbnormalPanel />
        </div>
      </div>
    </div>
  );
}
