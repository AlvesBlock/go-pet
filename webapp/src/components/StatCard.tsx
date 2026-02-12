import type { ReactNode } from "react";
import clsx from "classnames";

interface Props {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  trend?: { value: string; direction: "up" | "down"; tone?: "positive" | "negative" };
  accent?: "brand" | "accent" | "neutral";
}

const colors = {
  brand: "from-brand-500/15 to-brand-300/10 text-brand-700",
  accent: "from-accent-500/15 to-accent-300/10 text-accent-700",
  neutral: "from-slate-200/60 to-white text-slate-700",
};

export function StatCard({ label, value, helper, icon, trend, accent = "neutral" }: Props) {
  return (
    <div className="gradient-border rounded-3xl bg-white p-5 shadow-card">
      <div className={clsx("mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-br p-3", colors[accent])}>
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className="font-display text-3xl text-slate-900">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
        {trend && (
          <span
            className={clsx(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.tone === "negative" ? "bg-danger/10 text-danger" : "bg-emerald-100 text-emerald-700",
            )}
          >
            {trend.direction === "up" ? "▲" : "▼"} {trend.value}
          </span>
        )}
        <span>{helper}</span>
      </div>
    </div>
  );
}
