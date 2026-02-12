import { formatDistanceToNow } from "date-fns";
import type { Incident, SupportTicket } from "../types";
import { Shield, MessageSquareWarning } from "lucide-react";

interface Props {
  incidents: Incident[];
  tickets: SupportTicket[];
}

export function ActivityFeed({ incidents, tickets }: Props) {
  const feed = [
    ...incidents.map((incident) => ({
      id: incident.id,
      type: "incident" as const,
      title: incident.title,
      description: incident.description,
      createdAt: new Date(incident.createdAt),
      severity: incident.severity,
      status: incident.status,
    })),
    ...tickets.map((ticket) => ({
      id: ticket.id,
      type: "ticket" as const,
      title: ticket.subject,
      description: ticket.summary,
      createdAt: new Date(ticket.createdAt),
      severity: ticket.priority,
      status: ticket.status,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-4">
      {feed.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              {item.type === "incident" ? (
                <Shield className="text-danger" size={18} />
              ) : (
                <MessageSquareWarning className="text-brand-500" size={18} />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400">
                {formatDistanceToNow(item.createdAt, { addSuffix: true })}
              </p>
            </div>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {item.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
