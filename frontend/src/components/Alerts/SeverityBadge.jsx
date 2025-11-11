import { severityColors } from "../../utils/severityColors";

export default function SeverityBadge({ severity }) {
  return (
    <span
      className={`${severityColors[severity]} px-3 py-1 rounded-full text-sm`}
    >
      {severity}
    </span>
  );
}
