import clsx from "classnames";

export default function Badge({ severity }) {
  const cls = clsx(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    severity === "Critical" && "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
    severity === "Moderate" && "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
    severity === "Low" && "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
  );
  return <span className={cls}>{severity}</span>;
}
