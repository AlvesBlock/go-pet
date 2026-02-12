import { useState } from "react";
import type { FormEvent } from "react";
import { useAppStore } from "../store/appStore";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { AlertTriangle, FileWarning, Headset, MapPin, PhoneIncoming, SendHorizonal } from "lucide-react";

export default function SupportView() {
  const tickets = useAppStore((state) => state.tickets);
  const incidents = useAppStore((state) => state.incidents);
  const logIncident = useAppStore((state) => state.logIncident);

  const [rideId, setRideId] = useState("ride_1");
  const [description, setDescription] = useState("Tutor deseja falar com operação após SOS.");

  const handleIncident = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await logIncident({
      rideId,
      title: "Novo incidente manual",
      description,
      severity: "medium",
      status: "open",
    });
    setDescription("");
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Central de suporte/SOS</p>
            <h1 className="font-display text-3xl text-slate-900">Atendimento 24/7, mascaramento LGPD e incidentes auditáveis.</h1>
            <p className="text-slate-500">Tickets, gravações, chamadas mascaradas e plano de resposta.</p>
          </div>
          <button className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-600">
            Abrir playbook
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <form onSubmit={handleIncident} className="space-y-4 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Registrar incidente" subtitle="Fotos e geolocalização anexas" />
          <label className="space-y-2 text-sm text-slate-600">
            <span>ID da corrida</span>
            <input
              value={rideId}
              onChange={(event) => setRideId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Descrição</span>
            <textarea
              value={description}
              rows={4}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <FileWarning size={12} /> Checklist obrigatório
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <MapPin size={12} /> Geo + fotos
            </span>
          </div>
          <button className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white shadow-card hover:bg-brand-500">
            Enviar
          </button>
        </form>

        <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Tickets ativos" subtitle="Prioridade e status" />
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{ticket.subject}</p>
                  <StatusBadge status="REQUESTED" />
                </div>
                <p className="text-xs text-slate-500">{ticket.summary}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>Prioridade: {ticket.priority}</span>
                  <span>Corrida: {ticket.rideId ?? "-"}</span>
                  <span>Status: {ticket.status}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold hover:border-brand-300 hover:text-brand-600">
                    Responder
                  </button>
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold hover:border-brand-300 hover:text-brand-600">
                    Escalar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Fila SOS" subtitle="Tutor/Motorista" />
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {incidents.slice(0, 3).map((incident) => (
              <div key={incident.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{incident.title}</p>
                  <p className="text-xs text-slate-500">{incident.description}</p>
                </div>
                <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">{incident.severity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Canais de atendimento" />
          <div className="mt-4 grid gap-4 text-sm text-slate-600">
            <button className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
              <span className="flex items-center gap-2">
                <Headset size={16} /> Atendimento in-app
              </span>
              <SendHorizonal size={14} />
            </button>
            <button className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
              <span className="flex items-center gap-2">
                <PhoneIncoming size={16} /> Chamada mascarada
              </span>
              <AlertTriangle size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
