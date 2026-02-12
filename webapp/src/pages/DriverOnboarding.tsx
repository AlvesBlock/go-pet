import { useState } from "react";
import { CalendarClock, Car, CheckCircle2, ClipboardSignature, Mail, Phone, ShieldCheck, Truck, User } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { SectionHeader } from "../components/SectionHeader";
import type { RideCategory } from "../types";
import { apiUpload } from "../services/gopetApi";

const categoryOptions: { id: RideCategory; label: string; helper: string }[] = [
  { id: "BASIC", label: "PetGo Básico", helper: "Pets até 20 kg" },
  { id: "PLUS", label: "PetGo Plus", helper: "2 pets pequenos / 35 kg" },
  { id: "SUV", label: "Pet SUV", helper: "Pets grandes" },
  { id: "VET", label: "Pet Vet Priority", helper: "Pós-cirúrgico" },
];

const equipmentOptions = [
  "Cintos peitorais",
  "Caixa de transporte universal",
  "Forro impermeável",
  "Spray enzimático",
  "Manta térmica",
  "Rampas para pets idosos",
];

const steps = [
  { title: "Informações pessoais", icon: <User size={18} /> },
  { title: "Veículo e categorias", icon: <Truck size={18} /> },
  { title: "Equipamentos e treinamento", icon: <ShieldCheck size={18} /> },
];

export default function DriverOnboarding() {
  const createDriver = useAppStore((state) => state.createDriver);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [createdDriverId, setCreatedDriverId] = useState<string>();
  const [uploadingField, setUploadingField] = useState<"cnh" | "photo" | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cnhNumber: "",
    cnhExpiresAt: "",
    cnhDocumentUrl: "",
    profilePhotoUrl: "",
    vehicleModel: "",
    vehiclePlate: "",
    vehicleYear: "",
    categories: [] as RideCategory[],
    equipments: [] as string[],
    trainingCompletedAt: "",
  });

  const handleCategoryToggle = (cat: RideCategory) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter((item) => item !== cat) : [...prev.categories, cat],
    }));
  };

  const handleEquipmentToggle = (equipment: string) => {
    setForm((prev) => ({
      ...prev,
      equipments: prev.equipments.includes(equipment)
        ? prev.equipments.filter((item) => item !== equipment)
        : [...prev.equipments, equipment],
    }));
  };

  const handleFileUpload = async (file: File | null, field: "cnhDocumentUrl" | "profilePhotoUrl") => {
    if (!file) return;
    setUploadingField(field === "cnhDocumentUrl" ? "cnh" : "photo");
    try {
      const url = await apiUpload(file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível enviar o arquivo.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(undefined);
    try {
      if (!form.name || !form.email || !form.cnhNumber || !form.cnhExpiresAt || !form.vehicleModel || !form.vehiclePlate) {
        setFeedback("Preencha todos os campos obrigatórios.");
        setIsSubmitting(false);
        return;
      }
      if (!form.categories.length) {
        setFeedback("Selecione pelo menos uma categoria que seu veículo suporta.");
        setIsSubmitting(false);
        return;
      }
      if (!form.equipments.length) {
        setFeedback("Selecione os equipamentos disponíveis.");
        setIsSubmitting(false);
        return;
      }

      const driver = await createDriver({
        name: form.name,
        email: form.email,
        phone: form.phone,
        cnhNumber: form.cnhNumber,
        cnhExpiresAt: form.cnhExpiresAt,
        cnhDocumentUrl: form.cnhDocumentUrl || undefined,
        profilePhotoUrl: form.profilePhotoUrl || undefined,
        vehicle: {
          model: form.vehicleModel,
          plate: form.vehiclePlate,
          year: form.vehicleYear || `${new Date().getFullYear()}`,
        },
        categories: form.categories,
        equipments: form.equipments,
        trainingCompletedAt: form.trainingCompletedAt || undefined,
      });
      setCreatedDriverId(driver.id);
      setFeedback("Cadastro enviado com sucesso! Nossa equipe vai revisar em até 48h.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não conseguimos enviar seu cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (createdDriverId) {
      return (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 />
            <div>
              <p className="font-semibold">Pedido recebido!</p>
              <p className="text-sm">Protocolo: {createdDriverId}</p>
            </div>
          </div>
          <p className="mt-3 text-sm">
            Você receberá atualizações por e-mail sobre treinamento, checklist de equipamentos e status do KYC.
          </p>
        </div>
      );
    }

    if (step === 0) {
      return (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            Nome completo
            <div className="mt-1 flex items-center rounded-2xl border border-slate-200 px-4">
              <User size={16} className="text-slate-400" />
              <input
                className="w-full border-none bg-transparent px-2 py-3 text-sm focus:outline-none"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Email
            <div className="mt-1 flex items-center rounded-2xl border border-slate-200 px-4">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                className="w-full border-none bg-transparent px-2 py-3 text-sm focus:outline-none"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Telefone
            <div className="mt-1 flex items-center rounded-2xl border border-slate-200 px-4">
              <Phone size={16} className="text-slate-400" />
              <input
                className="w-full border-none bg-transparent px-2 py-3 text-sm focus:outline-none"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-600">
              CNH
              <div className="mt-1 flex items-center rounded-2xl border border-slate-200 px-4">
                <ClipboardSignature size={16} className="text-slate-400" />
                <input
                  className="w-full border-none bg-transparent px-2 py-3 text-sm focus:outline-none"
                  value={form.cnhNumber}
                  onChange={(event) => setForm((prev) => ({ ...prev, cnhNumber: event.target.value }))}
                />
              </div>
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Validade da CNH
              <div className="mt-1 flex items-center rounded-2xl border border-slate-200 px-4">
                <CalendarClock size={16} className="text-slate-400" />
                <input
                  type="date"
                  className="w-full border-none bg-transparent px-2 py-3 text-sm focus:outline-none"
                  value={form.cnhExpiresAt}
                  onChange={(event) => setForm((prev) => ({ ...prev, cnhExpiresAt: event.target.value }))}
                />
              </div>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-600">
              Upload da CNH (foto)
              <div className="mt-1 rounded-2xl border border-dashed border-slate-300 p-4 text-center">
                <input type="file" accept="image/*" onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null, "cnhDocumentUrl")} />
                {uploadingField === "cnh" && <p className="mt-2 text-xs text-slate-500">Enviando documento...</p>}
                {form.cnhDocumentUrl && <img src={form.cnhDocumentUrl} alt="CNH" className="mx-auto mt-3 h-24 rounded-xl object-cover" />}
              </div>
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Foto recente
              <div className="mt-1 rounded-2xl border border-dashed border-slate-300 p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null, "profilePhotoUrl")}
                />
                {uploadingField === "photo" && <p className="mt-2 text-xs text-slate-500">Enviando foto...</p>}
                {form.profilePhotoUrl && (
                  <img src={form.profilePhotoUrl} alt="Perfil" className="mx-auto mt-3 h-24 w-24 rounded-full object-cover" />
                )}
              </div>
            </label>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            Modelo do veículo
            <div className="mt-1 flex items-center rounded-2xl border border-slate-200 px-4">
              <Car size={16} className="text-slate-400" />
              <input
                className="w-full border-none bg-transparent px-2 py-3 text-sm focus:outline-none"
                value={form.vehicleModel}
                onChange={(event) => setForm((prev) => ({ ...prev, vehicleModel: event.target.value }))}
              />
            </div>
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-600">
              Placa
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
                value={form.vehiclePlate}
                onChange={(event) => setForm((prev) => ({ ...prev, vehiclePlate: event.target.value.toUpperCase() }))}
              />
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Ano
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
                value={form.vehicleYear}
                onChange={(event) => setForm((prev) => ({ ...prev, vehicleYear: event.target.value }))}
              />
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Categorias atendidas</p>
            <div className="grid gap-3 md:grid-cols-2">
              {categoryOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                    form.categories.includes(option.id) ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.helper}</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" checked={form.categories.includes(option.id)} onChange={() => handleCategoryToggle(option.id)} />
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-3">
          {equipmentOptions.map((equipment) => (
            <label key={equipment} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <span>{equipment}</span>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.equipments.includes(equipment)}
                onChange={() => handleEquipmentToggle(equipment)}
              />
            </label>
          ))}
        </div>
        <label className="block text-sm font-medium text-slate-600">
          Treinamento pet-friendly (data de conclusão)
          <input
            type="date"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none"
            value={form.trainingCompletedAt}
            onChange={(event) => setForm((prev) => ({ ...prev, trainingCompletedAt: event.target.value }))}
          />
        </label>
        <p className="text-xs text-slate-500">
          Confirmaremos checklist de equipamentos e treinamento antes da aprovação. Motoristas aprovados recebem onboarding presencial.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Programa GoPet Drivers</p>
            <h1 className="font-display text-3xl text-slate-900 lg:text-4xl">Faça parte da rede pet-friendly.</h1>
            <p className="mt-2 text-slate-500">
              Veículos adaptados, treinamento rápido e suporte operacional 24/7. Seus rendimentos com transparência e prioridade.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Benefícios</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Ticket médio 20% acima do ride-share tradicional</li>
              <li>Seguro especializado e suporte veterinário</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
        <SectionHeader title="Cadastro do motorista" subtitle="3 etapas rápidas" />

        <div className="mt-6 flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  step === index ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"
                }`}
              >
                <span className="rounded-full bg-white p-2 shadow-inner">{item.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-wide">Etapa {index + 1}</p>
                  <p className="font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-inner">
            {renderStep()}
            {feedback && <p className="mt-4 text-sm text-brand-600">{feedback}</p>}

            {!createdDriverId && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  disabled={step === 0}
                  className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed"
                  onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                >
                  Voltar
                </button>
                {step < steps.length - 1 ? (
                  <button
                    className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-card"
                    onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
                  >
                    Próxima etapa
                  </button>
                ) : (
                  <button
                    disabled={isSubmitting}
                    className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar cadastro"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft">
        <SectionHeader title="Checklist pré-aprovação" subtitle="Garanta que tudo está pronto" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Fotos do veículo (interno e externo) atualizadas",
            "Documentos do pet kit (manta, caixas, cintos) prontos para auditoria",
            "Treinamento GoPet Drivers concluído (vídeo 20 min + quiz)",
            "Seguro do veículo com cobertura passageiros",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
              <ShieldCheck size={16} className="text-brand-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
