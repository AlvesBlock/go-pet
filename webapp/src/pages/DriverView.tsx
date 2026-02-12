import { lazy, Suspense, useMemo, useState } from "react";
import { useAppStore } from "../store/appStore";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { RideProgress } from "../components/RideProgress";
import { formatCurrency } from "../utils/formatters";
import { BadgeCheck, Camera, CheckSquare, MapPin, ShieldCheck, Timer } from "lucide-react";
import { LoadingState } from "../components/LoadingState";

const RevenueChart = lazy(() => import("../components/charts/RevenueAreaChart"));

const revenueData = [
  { day: "Seg", value: 280 },
  { day: "Ter", value: 410 },
  { day: "Qua", value: 510 },
  { day: "Qui", value: 470 },
  { day: "Sex", value: 620 },
  { day: "Sab", value: 380 },
  { day: "Dom", value: 320 },
];

export default function DriverView() {
  const drivers = useAppStore((state) => state.drivers);
  const rides = useAppStore((state) => state.rides);
  const incidents = useAppStore((state) => state.incidents);
  const onboardingDrivers = drivers.filter((driver) => driver.applicationStatus && driver.applicationStatus !== "APPROVED");

  const driver = drivers[0];
  const activeRide = rides.find((ride) => ride.driver?.id === driver?.id) ?? rides[0];
  const [equipmentChecklist, setEquipmentChecklist] = useState<Record<string, boolean>>({
    "Cinto peitoral grande": true,
    "Caixa universal": true,
    "Forro impermeável": true,
    "Spray enzimático": false,
    "Manta térmica": true,
  });

  const offers = useMemo(
    () =>
      rides.slice(0, 3).map((ride) => ({
        id: ride.id,
        pet: ride.pet.name,
        category: ride.category,
        distance: `${ride.estimatedDistanceKm} km`,
        price: formatCurrency(ride.price),
        status: ride.status,
      })),
    [rides],
  );

  const handleChecklist = (item: string) => {
    setEquipmentChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Console do motorista</p>
            <h1 className="font-display text-3xl text-slate-900">Aceite corridas em segundos, mantenha checklist e métricas.</h1>
            <p className="text-slate-500">Treinamento pet-friendly, auditoria contínua e ganhos semanais.</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-slate-500">Rating médio</p>
              <p className="text-3xl font-display text-slate-900">{driver?.rating.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Corridas</p>
              <p className="text-3xl font-display text-slate-900">{driver?.completedRuns}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Ofertas de corrida" subtitle="Matching sequencial ou multicast" />
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{offer.pet}</p>
                  <p className="text-xs text-slate-500">Categoria {offer.category}</p>
                </div>
                <p className="text-sm text-slate-500">{offer.distance}</p>
                <p className="font-semibold text-brand-600">{offer.price}</p>
                <StatusBadge status={offer.status} />
                <button className="rounded-full bg-brand-600 px-4 py-1 text-sm font-semibold text-white shadow-card hover:bg-brand-500">
                  Aceitar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <SectionHeader title="Ganhos semana" />
            <Suspense fallback={<LoadingState compact message="Carregando gráfico..." />}>
              <RevenueChart data={revenueData} />
            </Suspense>
            <p className="text-sm text-slate-500">Meta semanal: {formatCurrency(2600)} • Emitido todas as segundas.</p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <SectionHeader title="Checklist obrigatório" />
            <div className="space-y-3 text-sm text-slate-600">
              {Object.entries(equipmentChecklist).map(([item, checked]) => (
                <label key={item} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckSquare className={checked ? "text-brand-500" : "text-slate-400"} size={18} />
                    <span>{item}</span>
                  </div>
                  <input type="checkbox" checked={checked} onChange={() => handleChecklist(item)} className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
                </label>
              ))}
            </div>
            <button className="mt-4 w-full rounded-full border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700">
              Enviar fotos
            </button>
          </div>
        </div>
      </section>

      {activeRide && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-soft">
            <SectionHeader title="Corrida ativa" subtitle={`${activeRide.pet.name} • ${activeRide.tutorName}`} />
            <RideProgress status={activeRide.status} />
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                <Timer size={14} /> ETA {activeRide.driver?.etaMinutes} min
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                <MapPin size={14} /> {activeRide.pickupAddress}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                <Camera size={14} /> Checklist foto obrigatória
              </span>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-soft">
            <SectionHeader title="Compliance & treinamentos" />
            <div className="grid gap-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="text-brand-500" />
                  <div>
                    <p className="font-semibold text-slate-800">KYC e antecedentes</p>
                    <p className="text-xs text-slate-500">Atualizado em 04/2025</p>
                  </div>
                </div>
                <StatusBadge status="COMPLETED" />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-brand-500" />
                  <div>
                    <p className="font-semibold text-slate-800">Treinamento Vet Priority</p>
                    <p className="text-xs text-slate-500">Próximo quiz em 23 dias</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">OK</span>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-800">Alertas recentes</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
                  {incidents.slice(0, 2).map((incident) => (
                    <li key={incident.id}>{incident.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
        <SectionHeader title="Status de onboarding" subtitle="Acompanhe o processo de aprovação" />
        <div className="grid gap-4 md:grid-cols-2">
          {onboardingDrivers.slice(0, 4).map((driver) => (
            <div key={driver.id} className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{driver.name}</p>
              <p className="text-xs text-slate-400">{driver.email}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Status atual</p>
              <p className="font-semibold text-brand-600">{driver.applicationStatus}</p>
              <p className="mt-2 text-xs text-slate-500">
                Categorias: {driver.categories?.join(", ") ?? driver.vehicle.category.join(", ")}
              </p>
            </div>
          ))}
          {!onboardingDrivers.length && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
              Nenhum cadastro pendente. Use o menu "Seja motorista" para convidar novos parceiros.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
