import { useAlertStore } from "../../store/alertStore";
import AlertCard from "./AlertCard";

export default function AlertsList() {
  const alerts = useAlertStore((s) => s.alerts);

  return (
    <div>
      {alerts.map((a) => (
        <AlertCard key={a.event.id} a={a} />
      ))}
    </div>
  );
}
