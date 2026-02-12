import type { RideEvent } from "../types";
import { StatusBadge } from "./StatusBadge";
import { formatTime } from "../utils/formatters";

interface Props {
  events: RideEvent[];
}

export function Timeline({ events }: Props) {
  return (
    <ol className="relative space-y-6 border-l border-slate-200 pl-6">
      {events.map((event) => (
        <li key={event.id} className="space-y-1">
          <div className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-brand-500 shadow"></div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-800">{event.title}</p>
            <StatusBadge status={event.status} />
          </div>
          <p className="text-sm text-slate-500">{event.description}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">{formatTime(event.at)}</p>
        </li>
      ))}
    </ol>
  );
}
