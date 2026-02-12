import clsx from "classnames";
import type { RideStatus } from "../types";

const statusMap: Record<RideStatus | "READY" | "ALERT", { label: string; classes: string }> = {
  REQUESTED: { label: "Solicitado", classes: "bg-slate-100 text-slate-700" },
  DISPATCHING: { label: "Despachando", classes: "bg-brand-50 text-brand-700" },
  DRIVER_ACCEPTED: { label: "Motorista aceitou", classes: "bg-emerald-100 text-emerald-700" },
  EN_ROUTE_PICKUP: { label: "Rumo ao tutor", classes: "bg-brand-100 text-brand-700" },
  ARRIVED_PICKUP: { label: "Chegou", classes: "bg-brand-200 text-brand-800" },
  PET_ONBOARD: { label: "Pet a bordo", classes: "bg-indigo-100 text-indigo-700" },
  EN_ROUTE_DROPOFF: { label: "Em trânsito", classes: "bg-sky-100 text-sky-700" },
  COMPLETED: { label: "Concluída", classes: "bg-emerald-100 text-emerald-700" },
  CANCELLED_BY_TUTOR: { label: "Cancelada tutor", classes: "bg-slate-200 text-slate-600" },
  CANCELLED_BY_DRIVER: { label: "Cancelada motorista", classes: "bg-slate-200 text-slate-600" },
  CANCELLED_BY_SYSTEM: { label: "Cancelada sistema", classes: "bg-slate-200 text-slate-600" },
  READY: { label: "Pronto", classes: "bg-emerald-50 text-emerald-700" },
  ALERT: { label: "Incidente", classes: "bg-danger/10 text-danger" },
};

interface Props {
  status: RideStatus | "READY" | "ALERT";
}

export function StatusBadge({ status }: Props) {
  const data = statusMap[status];
  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", data.classes)}>
      {data.label}
    </span>
  );
}
