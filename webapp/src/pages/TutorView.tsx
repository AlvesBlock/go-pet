import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CalendarClock, CreditCard, MapPin, MessageCircle, PawPrint, Phone, Plus, Shield, Zap } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { SectionHeader } from "../components/SectionHeader";
import { RideProgress } from "../components/RideProgress";
import { Timeline } from "../components/Timeline";
import { StatusBadge } from "../components/StatusBadge";
import { ChatPanel } from "../components/ChatPanel";
import { MapPreview } from "../components/MapPreview";
import { formatCurrency } from "../utils/formatters";
import type { RideCategory } from "../types";

const categories: { id: RideCategory; label: string; helper: string }[] = [
  { id: "BASIC", label: "PetGo Básico", helper: "1 pet até 20 kg" },
  { id: "PLUS", label: "PetGo Plus", helper: "2 pets pequenos ou 35 kg" },
  { id: "SUV", label: "Pet SUV", helper: "Pets grandes e rampas" },
  { id: "VET", label: "Pet Vet Priority", helper: "Pós-cirúrgico" },
];

export default function TutorView() {
  const pets = useAppStore((state) => state.pets);
  const rides = useAppStore((state) => state.rides);
  const allMessages = useAppStore((state) => state.messages);
  const createRide = useAppStore((state) => state.createRide);
  const simulateRideLifecycle = useAppStore((state) => state.simulateRideLifecycle);
  const activeRide = rides[0];
  const messages = useMemo(() => {
    if (!activeRide) return [];
    return allMessages.filter((msg) => msg.rideId === activeRide.id);
  }, [allMessages, activeRide]);

  const [formPet, setFormPet] = useState(pets[0]?.id ?? "");
  const [category, setCategory] = useState<RideCategory>("BASIC");
  const [pickup, setPickup] = useState("Rua dos Pinheiros, 123");
  const [dropoff, setDropoff] = useState("Clínica Vet Vida - Av. Paulista");
  const [schedule, setSchedule] = useState(() => new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState("Levar caixa rosa, Luna fica calma assim.");
  const [quoteMultiplier, setQuoteMultiplier] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string>();

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === formPet), [pets, formPet]);
  const basePrice = 42;
  const estimatedPrice = formatCurrency(basePrice * quoteMultiplier);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPet) return;
    setIsSubmitting(true);
    try {
      const newRide = await createRide({
        tutorName: "Marina Costa",
        petId: selectedPet.id,
        category,
        pickupAddress: pickup,
        destinationAddress: dropoff,
        scheduledAt: new Date(schedule),
        notes,
      });
      simulateRideLifecycle(newRide.id);
      setFeedback(`Corrida ${newRide.id} criada e despachando motoristas.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar a corrida.";
      setFeedback(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Painel do tutor</p>
            <h1 className="font-display text-3xl text-slate-900 lg:text-4xl">Solicite, acompanhe e cuide do transporte do seu pet.</h1>
            <p className="mt-2 text-slate-500">Matching ≤ 12 s, checklist com foto, chat e pagamentos seguros.</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Carteira pet família</p>
            <p>Saldo disponível: <strong className="text-brand-600">{formatCurrency(82)}</strong></p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-soft">
          <SectionHeader title="Solicitar corrida" subtitle="Pré-autorização e matching inteligente" />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Pet</span>
              <select
                value={formPet}
                onChange={(event) => setFormPet(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
              >
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} • {pet.size}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Categoria</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as RideCategory)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} — {item.helper}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <MapPin size={14} /> Origem
              </span>
              <input
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <MapPin size={14} /> Destino
              </span>
              <input
                value={dropoff}
                onChange={(event) => setDropoff(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <CalendarClock size={14} /> Quando?
              </span>
              <input
                type="datetime-local"
                value={schedule}
                onChange={(event) => setSchedule(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <CreditCard size={14} /> Multiplicador demanda
              </span>
              <input
                type="range"
                min={1}
                max={1.6}
                step={0.05}
                value={quoteMultiplier}
                onChange={(event) => setQuoteMultiplier(Number(event.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500">Estimativa: {estimatedPrice}</p>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <MessageCircle size={14} /> Notas ao motorista
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Shield size={12} /> LGPD & auditoria
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Zap size={12} /> Pré-autorização {formatCurrency(15)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Plus size={12} /> Cupom corporativo
            </span>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white shadow-card hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Enviando..." : "Solicitar corrida"}
          </button>
          {feedback && <p className="text-center text-sm text-emerald-600">{feedback}</p>}
        </form>

        <div className="space-y-6">
          <MapPreview
            origin={pickup}
            destination={dropoff}
            eta={activeRide ? `${activeRide.estimatedDurationMin} min` : "15 min"}
            distance={activeRide ? `${activeRide.estimatedDistanceKm} km` : "6,2 km"}
          />
          {activeRide && <RideProgress status={activeRide.status} />}
          {selectedPet && (
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pet selecionado</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <PawPrint />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedPet.name}</p>
                  <p className="text-xs text-slate-500">
                    {selectedPet.species} • {selectedPet.size} • {selectedPet.temperament}
                  </p>
                </div>
              </div>
              {selectedPet.needs && <p className="mt-3 text-sm text-slate-500">{selectedPet.needs}</p>}
            </div>
          )}
        </div>
      </section>

      {activeRide && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-soft">
            <SectionHeader title="Status da corrida" subtitle={`${activeRide.pet.name} • ${activeRide.category}`} />
            <Timeline events={activeRide.timeline} />
            <div className="rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
              <p>
                Motorista <strong>{activeRide.driver?.name}</strong> com rating {activeRide.driver?.rating} — chegada em{" "}
                {activeRide.driver?.etaMinutes} min.
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            <ChatPanel messages={messages} />
            <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Pagamento estimado</p>
                  <p className="text-3xl font-display text-slate-900">{formatCurrency(activeRide.price)}</p>
                </div>
                <StatusBadge status={activeRide.status} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-500">
                <p>Base: {formatCurrency(12)}</p>
                <p>Km: {formatCurrency(4.2 * activeRide.estimatedDistanceKm)}</p>
                <p>Tempo: {formatCurrency(0.8 * activeRide.estimatedDurationMin)}</p>
                <p className="font-semibold text-slate-700">Subtotal: {formatCurrency(activeRide.price)}</p>
              </div>
              <button className="mt-4 w-full rounded-full border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700">
                Compartilhar corrida
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Pets cadastrados" subtitle="Gerencie perfis, vacinas e necessidades especiais." />
          <div className="grid gap-4">
            {pets.map((pet) => (
              <div key={pet.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{pet.name}</p>
                  <p className="text-xs text-slate-500">
                    {pet.species} • {pet.size} • {pet.temperament}
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>Caixa obrigatória: {pet.crateRequired ? "Sim" : "Não"}</p>
                  <p>Vacinas: {pet.vaccinesUpToDate ? "OK" : "Atualizar"}</p>
                </div>
                <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold hover:border-brand-300 hover:text-brand-600">
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft">
          <SectionHeader title="Canais de suporte" subtitle="SOS pet e linha humana 24/7" />
          <div className="grid gap-3 text-sm text-slate-600">
            <button className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 hover:border-brand-300">
              <span className="font-semibold text-slate-800">SOS do pet</span>
              <Phone size={16} />
            </button>
            <button className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 hover:border-brand-300">
              <span className="font-semibold text-slate-800">Falar com operação</span>
              <MessageCircle size={16} />
            </button>
            <button className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 hover:border-brand-300">
              <span className="font-semibold text-slate-800">Registrar incidente com foto</span>
              <PawPrint size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
