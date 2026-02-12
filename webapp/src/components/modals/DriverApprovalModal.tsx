import { Dialog } from "@headlessui/react";
import { useState } from "react";
import type { Driver } from "../../types";
import { format } from "date-fns";

interface Props {
  driver?: Driver;
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: Driver["applicationStatus"], notes?: string) => Promise<void>;
  updating?: boolean;
}

const statusOptions: Array<{ label: string; value: Driver["applicationStatus"] }> = [
  { label: "Aprovar", value: "APPROVED" },
  { label: "Rejeitar", value: "REJECTED" },
  { label: "Suspender", value: "SUSPENDED" },
  { label: "Revisar depois", value: "PENDING" },
];

export function DriverApprovalModal({ driver, open, onClose, onStatusChange, updating }: Props) {
  const [status, setStatus] = useState<Driver["applicationStatus"]>("APPROVED");
  const [notes, setNotes] = useState("");
  if (!driver) {
    return null;
  }

  const handleSubmit = async () => {
    await onStatusChange(status, notes);
    setNotes("");
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-card">
          <Dialog.Title className="text-lg font-semibold text-slate-900">Analisar motorista</Dialog.Title>
          <p className="text-sm text-slate-500">KYC, veículo e treinamentos</p>

        <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-900">{driver.name}</p>
              <p className="text-xs text-slate-500">{driver.email}</p>
              <p className="text-xs text-slate-500">{driver.phone}</p>
              {driver.profilePhotoUrl ? (
                <img src={driver.profilePhotoUrl} alt="Perfil" className="mt-3 h-20 w-20 rounded-full object-cover" />
              ) : (
                <p className="mt-3 text-xs text-slate-400">Sem foto enviada.</p>
              )}
            </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-slate-800">Veículo</p>
            <p>{driver.vehicle.model}</p>
            <p className="text-xs text-slate-500">
                Placa {driver.vehicle.plate} · ano {driver.vehicleYear ?? "N/A"}
              </p>
              <p className="text-xs text-slate-500">Categorias: {driver.categories?.join(", ") ?? driver.vehicle.category.join(", ")}</p>
            </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-slate-800">CNH & Treinamentos</p>
            <p className="text-xs text-slate-500">Validade CNH: {driver.cnhExpiresAt ? format(new Date(driver.cnhExpiresAt), "dd/MM/yyyy") : "N/A"}</p>
            {driver.trainingCompletedAt && (
              <p className="text-xs text-slate-500">Treinamento: {format(new Date(driver.trainingCompletedAt), "dd/MM/yyyy")}</p>
            )}
            <div className="mt-3 space-y-1">
              <p className="text-xs text-slate-500">CNH anexada</p>
              {driver.cnhDocumentUrl ? (
                <>
                  <img src={driver.cnhDocumentUrl} alt="CNH" className="h-32 w-full rounded-xl object-cover" />
                  <a
                    href={driver.cnhDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-brand-600 underline"
                  >
                    Abrir em nova aba
                  </a>
                </>
              ) : (
                <p className="text-xs text-slate-400">Sem documento anexado.</p>
              )}
            </div>
          </div>
            {!!driver.applicationHistory?.length && (
              <div className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-800">Histórico</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-500">
                  {driver.applicationHistory.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-slate-600">
              Alterar status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as Driver["applicationStatus"])}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-600">
              Observações (opcional)
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                maxLength={280}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-400 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-600" onClick={onClose}>
              Cancelar
            </button>
            <button
              disabled={updating}
              className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow-card disabled:opacity-60"
              onClick={handleSubmit}
            >
              {updating ? "Salvando..." : "Salvar decisão"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
