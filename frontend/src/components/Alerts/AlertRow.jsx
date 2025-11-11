import Badge from "../Common/Badge";
import { prettyTime } from "../../utils/formate";

export default function AlertRow({ row }) {
  const e = row.event;
  return (
    <tr className="table-row">
      <td className="px-3 py-2 font-mono text-sm">{e.cameraId}</td>
      <td className="px-3 py-2">{e.label}</td>
      <td className="px-3 py-2"><Badge severity={row.severity} /></td>
      <td className="px-3 py-2">{(e.confidence*100).toFixed(0)}%</td>
      <td className="px-3 py-2">{row.freqInWindow}</td>
      <td className="px-3 py-2">{prettyTime(e.timestamp)}</td>
      <td className="px-3 py-2 text-right font-mono text-xs text-neutral-400">{row.score}</td>
    </tr>
  );
}
