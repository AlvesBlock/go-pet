import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Smartphone, Workflow } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { StatCard } from "../components/StatCard";
import { SectionHeader } from "../components/SectionHeader";
import { CategoryCard } from "../components/CategoryCard";
import { MapPreview } from "../components/MapPreview";
import { Timeline } from "../components/Timeline";
import type { RideCategory } from "../types";

const categoryCards: Array<{
  category: RideCategory;
  description: string;
  priceFrom: string;
  badge?: string;
}> = [
  {
    category: "BASIC",
    description: "Para cães e gatos até 20 kg com cintos peitorais e forro de banco obrigatório.",
    priceFrom: "R$ 39",
    badge: "Popular",
  },
  {
    category: "PLUS",
    description: "Dois pets pequenos ou médio porte. Inclui caixa universal e spray enzimático.",
    priceFrom: "R$ 54",
  },
  {
    category: "SUV",
    description: "Espaço adicional, rampas para idosos e cintos para porte grande.",
    priceFrom: "R$ 89",
    badge: "Pets grandes",
  },
  {
    category: "VET",
    description: "Linha prioridade pós-cirúrgico com manta térmica e canal SOS dedicado.",
    priceFrom: "R$ 119",
    badge: "Priority",
  },
] as const;

const architectureHighlights = [
  {
    title: "Matching inteligente",
    copy: "Filtros por raio, categoria, equipamento obrigatório e SLA de chegada ≤ 12 min.",
    icon: <Workflow className="text-brand-500" size={24} />,
  },
  {
    title: "Protocolos de segurança",
    copy: "Checklist com fotos, SOS pet/humano e auditoria LGPD com mascaramento.",
    icon: <ShieldCheck className="text-brand-500" size={24} />,
  },
  {
    title: "Experiência mobile",
    copy: "Apps Flutter/React Native com tracking em tempo real, chat e push crítico.",
    icon: <Smartphone className="text-brand-500" size={24} />,
  },
];

const roadmap = [
  {
    title: "MVP (90 dias)",
    items: [
      "Autenticação tutor/motorista",
      "Cadastro de pets e veículos",
      "Matching + tracking ao vivo",
      "Pagamentos cartão + Pix",
      "Chat + SOS básico",
    ],
  },
  {
    title: "V2 (90-180 dias)",
    items: [
      "Agendamentos recorrentes",
      "Multi-parada tutor ↔ clínica",
      "Planos corporativos veterinários",
      "Reputação avançada & limites",
      "Wallet família e vouchers",
    ],
  },
  {
    title: "V3+",
    items: [
      "Telemetria do veículo",
      "Câmera embarcada opcional",
      "Seguro integrado por corrida",
      "Marketplace banho/tosa",
      "Automação fraud-risk ML",
    ],
  },
];

export default function Landing() {
  const rides = useAppStore((state) => state.rides);
  const incidents = useAppStore((state) => state.incidents);
  const liveRide = rides[0];

  return (
    <div className="space-y-12">
      <section className="grid gap-10 rounded-[40px] border border-white/70 bg-white/80 p-10 shadow-card lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 px-4 py-1 text-sm font-semibold text-brand-700">
            Novo
            <span className="text-slate-500">Programa Pet Vet Priority</span>
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-tight text-slate-900 md:text-5xl">
              Transporte de pets com protocolo clínico, matching inteligente e experiência tipo Uber.
            </h1>
            <p className="text-lg text-slate-500 lg:text-xl">
              Motoristas pet-friendly com KYC, equipamentos obrigatórios e suporte 24/7. Corridas on-demand, agendadas e plano corporativo para clínicas e resgates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/tutor" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-card hover:bg-brand-500">
              Solicitar corrida agora
            </Link>
            <Link to="/driver" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700">
              Quero ser motorista
            </Link>
            <Link to="/driver/apply" className="rounded-full border border-brand-200 px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">
              Cadastre-se na rede
            </Link>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-500 lg:flex-row lg:items-center">
            <p>• SLA aceite motorista ≤ 12s (p95)</p>
            <p>• Pets grandes com rampas e cintos homologados</p>
            <p>• LGPD & auditoria completa</p>
          </div>
        </div>
        {liveRide && (
          <div className="space-y-4">
            <MapPreview
              origin={liveRide.pickupAddress}
              destination={liveRide.destinationAddress}
              eta={`${liveRide.estimatedDurationMin} min`}
              distance={`${liveRide.estimatedDistanceKm} km`}
            />
            <div className="rounded-3xl border border-brand-100 bg-brand-50/60 px-6 py-4 text-sm text-brand-800 shadow-soft">
              <p className="font-semibold text-brand-900">
                {liveRide.pet.name} ({liveRide.category})
              </p>
              <p>Motorista {liveRide.driver?.name} está a {liveRide.driver?.etaMinutes ?? 7} min do tutor.</p>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Matching p95"
          value="11,2 s"
          helper="Motorista certo em menos de 12 s"
          accent="brand"
          trend={{ value: "8%", direction: "up" }}
          icon={<ShieldCheck />}
        />
        <StatCard
          label="NPS tutores"
          value="+78"
          helper="Foco em cuidados com o pet"
          accent="accent"
          icon={<ArrowUpRight />}
        />
        <StatCard
          label="Corridas Vet Priority"
          value="312/mês"
          helper="SLAs com clínicas parceiras"
          accent="neutral"
        />
        <StatCard
          label="Checklist com foto"
          value="98,7%"
          helper="taxa de conformidade"
          accent="brand"
        />
      </section>

      <section className="space-y-6">
        <SectionHeader title="Categorias e limites" subtitle="Escopo do MVP com equipamentos obrigatórios." />
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {categoryCards.map((card) => (
            <CategoryCard
              key={card.category}
              category={card.category}
              description={card.description}
              priceFrom={card.priceFrom}
              badge={card.badge}
            />
          ))}
        </div>
      </section>

      {liveRide && (
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft">
            <SectionHeader title="Corrida em andamento" subtitle={`${liveRide.pet.name} • ${liveRide.tutorName}`} />
            <Timeline events={liveRide.timeline} />
          </div>
          <div className="space-y-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft">
            <SectionHeader title="Incidentes monitorados" subtitle="Planos de resposta 24/7" />
            <ul className="space-y-4">
              {incidents.slice(0, 2).map((incident) => (
                <li key={incident.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{incident.title}</p>
                    <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">{incident.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">{incident.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="space-y-8 rounded-[32px] border border-white/50 bg-white/80 p-6 shadow-soft">
        <SectionHeader title="Arquitetura do produto" subtitle="Mobile Flutter/React Native + Backend Nest/Postgres + Realtime." />
        <div className="grid gap-6 md:grid-cols-3">
          {architectureHighlights.map((highlight) => (
            <div key={highlight.title} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="mb-3 inline-flex rounded-2xl bg-white p-2">{highlight.icon}</div>
              <p className="font-semibold text-slate-900">{highlight.title}</p>
              <p className="text-sm text-slate-500">{highlight.copy}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Backend modular NestJS</p>
            <p>Auth/IAM • Pets • Drivers • Pricing • Payments • Matching • Chat • Support</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Infra & Observabilidade</p>
            <p>Docker + K8s • Redis GEO • PostGIS • OpenTelemetry • Grafana • Feature Flags.</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Pagamentos & compliance</p>
            <p>Cartão/Pix, pré-autorização, split marketplace, LGPD e trilhas de auditoria.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader title="Roadmap" subtitle="Evolução planejada por wave" />
        <div className="grid gap-6 lg:grid-cols-3">
          {roadmap.map((phase) => (
            <div key={phase.title} className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{phase.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
