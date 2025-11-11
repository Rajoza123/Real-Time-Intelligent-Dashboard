import { useEffect } from "react";
import { useAlertStore } from "../store/alertStore";

import AlertsList from "../components/Alerts/AlertsList";
import MetricsRow from "../components/Metrics/MetricsRow";
import AbnormalPanel from "../components/Abnormal/AbnormalPanel";

export default function Dashboard() {
  const { loadAlerts, loadAbnormal, alerts } = useAlertStore();

  useEffect(() => {
    loadAlerts();
    loadAbnormal();

    const interval = setInterval(() => {
      loadAlerts();
      loadAbnormal();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Real-Time Intelligent Dashboard</h1>

      <MetricsRow alerts={alerts} />
      <AlertsList />
      <AbnormalPanel />
    </div>
  );
}
