import clsx from "classnames";
import type { RideStatus } from "../types";

const flow: RideStatus[] = [
  "REQUESTED",
  "DISPATCHING",
  "DRIVER_ACCEPTED",
  "EN_ROUTE_PICKUP",
  "ARRIVED_PICKUP",
  "PET_ONBOARD",
  "EN_ROUTE_DROPOFF",
  "COMPLETED",
];

const labels: Record<RideStatus, string> = {
  REQUESTED: "Solicitado",
  DISPATCHING: "Despacho",
  DRIVER_ACCEPTED: "Aceito",
  EN_ROUTE_PICKUP: "Rumo ao tutor",
  ARRIVED_PICKUP: "Chegada",
  PET_ONBOARD: "Pet a bordo",
  EN_ROUTE_DROPOFF: "Rumo ao destino",
  COMPLETED: "Concluído",
  CANCELLED_BY_TUTOR: "Cancelado tutor",
  CANCELLED_BY_DRIVER: "Cancelado motorista",
  CANCELLED_BY_SYSTEM: "Cancelado sistema",
};

interface Props {
  status: RideStatus;
}

export function RideProgress({ status }: Props) {
  const activeIndex = Math.max(
    flow.indexOf(status),
    0,
  );

  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-inner">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Fluxo da corrida</span>
        <span>{labels[status]}</span>
      </div>
      <div className="flex items-center gap-2">
        {flow.map((item, idx) => (
          <div key={item} className="flex flex-1 items-center gap-2">
            <div
              className={clsx(
                "flex h-3 w-3 items-center justify-center rounded-full border",
                idx <= activeIndex
                  ? "border-brand-500 bg-brand-500 shadow-card"
                  : "border-slate-200 bg-white",
              )}
            ></div>
            {idx < flow.length - 1 && (
              <div
                className={clsx(
                  "h-0.5 flex-1 rounded-full",
                  idx < activeIndex ? "bg-brand-400" : "bg-slate-100",
                )}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
