import { useAlertStore } from "../../store/alertStore";
import Spinner from "../Common/Spinner";
import AlertRow from "./AlertRow";

export default function AlertsList() {
  const { alerts, loading } = useAlertStore();

  return (
    <div className="card card-hover overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-800/60 px-4 py-3">
        <h3 className="text-sm font-semibold">Ranked Alerts</h3>
        {loading ? <Spinner /> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-950/60">
            <tr className="table-row">
              <th className="table-head px-3 py-2 text-left">Camera</th>
              <th className="table-head px-3 py-2 text-left">Label</th>
              <th className="table-head px-3 py-2 text-left">Severity</th>
              <th className="table-head px-3 py-2 text-left">Confidence</th>
              <th className="table-head px-3 py-2 text-left">Freq (win)</th>
              <th className="table-head px-3 py-2 text-left">Time</th>
              <th className="table-head px-3 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => <AlertRow key={a.event.id} row={a} />)}
            {!alerts.length && !loading ? (
              <tr><td className="px-4 py-6 text-center text-neutral-400" colSpan={7}>No alerts match filters</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
