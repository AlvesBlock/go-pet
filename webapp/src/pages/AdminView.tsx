import { lazy, Suspense, useMemo, useState } from "react";
import { useAppStore } from "../store/appStore";
import { pricingRules } from "../data/mock";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { ActivityFeed } from "../components/ActivityFeed";
import { formatCurrency } from "../utils/formatters";
import { AlertTriangle, DollarSign, Gauge, Shield } from "lucide-react";
import { LoadingState } from "../components/LoadingState";
import type { Driver } from "../types";
import { DriverApprovalModal } from "../components/modals/DriverApprovalModal";

const MatchingChart = lazy(() => import("../components/charts/MatchingSlaChart"));

const matchingData = [
  { day: "Seg", sla: 11.2 },
  { day: "Ter", sla: 10.4 },
  { day: "Qua", sla: 12.1 },
  { day: "Qui", sla: 11.9 },
  { day: "Sex", sla: 10.8 },
  { day: "Sab", sla: 12.4 },
  { day: "Dom", sla: 11.3 },
];

const driverStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  SUSPENDED: "bg-slate-200 text-slate-700",
  INACTIVE: "bg-slate-200 text-slate-600",
};

export default function AdminView() {
  const rides = useAppStore((state) => state.rides);
  const incidents = useAppStore((state) => state.incidents);
  const tickets = useAppStore((state) => state.tickets);
  const drivers = useAppStore((state) => state.drivers);
  const updateDriverStatus = useAppStore((state) => state.updateDriverStatus);
  const [rules, setRules] = useState(pricingRules);
  const [updatingId, setUpdatingId] = useState<string>();
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  const adjustRule = (id: string, value: number) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, surgeCap: value } : rule)));
  };

  const latestDrivers = useMemo(() => drivers.slice(0, 6), [drivers]);

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Admin • Operações e Pricing</p>
            <h1 className="font-display text-3xl text-slate-900">Controle SLA, precificação dinâmica e incidentes.</h1>
            <p className="text-slate-500">Monitoramento em tempo real, tuning de multiplicadores e trilha LGPD.</p>
          </div>
          <button className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-600">
            Publicar nova regra
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Matching p95"
          value="11,3 s"
          helper="Objetivo ≤ 12 s"
          accent="brand"
          icon={<Gauge />}
          trend={{ value: "2.8%", direction: "down", tone: "positive" }}
        />
        <StatCard
          label="Cancelamentos"
          value="2,3%"
          helper="Janela de tolerância ok"
          accent="accent"
          icon={<AlertTriangle />}
          trend={{ value: "0.4%", direction: "up", tone: "negative" }}
        />
        <StatCard
          label="Volume Pix/cartão"
          value={formatCurrency(482000)}
          helper="Últimos 30 dias"
          accent="neutral"
          icon={<DollarSign />}
        />
        <StatCard label="Incidentes críticos" value="4" helper="Sob acompanhamento" accent="brand" icon={<Shield />} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Regras de preço" subtitle="Base + km/min + multiplicador de demanda" />
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{rule.city}</p>
                    <p className="text-xs text-slate-500">
                      Base {formatCurrency(rule.baseFare)} · km {formatCurrency(rule.perKm)} · min {formatCurrency(rule.perMin)}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                    Surge máx {rule.surgeCap.toFixed(1)}x
                  </span>
                </div>
                <label className="mt-4 block">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Limite reputacional</span>
                  <input
                    type="range"
                    min={1}
                    max={2}
                    step={0.1}
                    value={rule.surgeCap}
                    onChange={(event) => adjustRule(rule.id, Number(event.target.value))}
                    className="w-full"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="SLA de matching" subtitle="tempo p95 por dia" />
          <Suspense fallback={<LoadingState compact message="Carregando gráfico..." />}>
            <MatchingChart data={matchingData} />
          </Suspense>
          <p className="text-xs text-slate-500">Meta global: 12 s. Alertas automáticos ao chegar em 11,8 s.</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Runbook e auditoria" subtitle="Últimas ações críticas" />
          <ul className="mt-4 space-y-4 text-sm text-slate-600">
            {rides.slice(0, 4).map((ride) => (
              <li key={ride.id} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-900">
                  {ride.tutorName} · {ride.pet.name}
                </p>
                <p className="text-xs text-slate-500">Status atual: {ride.status}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Última atualização {new Date(ride.lastUpdate).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Incidentes & tickets" subtitle="Prioridades operacionais" />
          <ActivityFeed incidents={incidents} tickets={tickets} />
        </div>
      </section>

      <section className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
        <SectionHeader title="Motoristas cadastrados" subtitle="Status do onboarding" />
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Motorista</th>
                <th className="px-3 py-2">Categorias</th>
                <th className="px-3 py-2">Equipamentos</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {latestDrivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-3 py-2">
                    <p className="font-semibold text-slate-900">{driver.name}</p>
                    <p className="text-xs text-slate-500">{driver.email}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {driver.categories?.join(", ") ?? driver.vehicle.category.join(", ")}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500">{driver.equipments.slice(0, 2).join(", ")}...</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        driverStatusStyles[driver.applicationStatus ?? "PENDING"] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {driver.applicationStatus ?? "PENDING"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600"
                      onClick={() => {
                        setSelectedDriver(driver);
                        setModalOpen(true);
                      }}
                    >
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
              {!latestDrivers.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-400" colSpan={4}>
                    Nenhum cadastro recebido ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <DriverApprovalModal
        driver={selectedDriver}
        open={modalOpen}
        updating={!!updatingId}
        onClose={() => {
          setModalOpen(false);
          setSelectedDriver(undefined);
        }}
        onStatusChange={async (nextStatus, notes) => {
          if (!selectedDriver) return;
          setUpdatingId(selectedDriver.id);
          await updateDriverStatus(selectedDriver.id, nextStatus ?? "PENDING", notes);
          setUpdatingId(undefined);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
