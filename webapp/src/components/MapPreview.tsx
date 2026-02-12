import { MapPin, Navigation } from "lucide-react";

interface Props {
  origin: string;
  destination: string;
  eta: string;
  distance: string;
}

export function MapPreview({ origin, destination, eta, distance }: Props) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-400">Trajeto estimado</p>
          <p className="font-display text-3xl">{eta}</p>
        </div>
        <div className="rounded-full bg-white/10 p-3">
          <Navigation />
        </div>
      </div>
      <div className="mt-6 space-y-4 text-sm text-slate-200">
        <div className="flex items-center gap-3">
          <MapPin className="text-brand-300" size={18} />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Origem</p>
            <p>{origin}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="text-accent-300" size={18} />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Destino</p>
            <p>{destination}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium">
        Distância estimada: <span className="font-semibold">{distance}</span>
      </div>
    </div>
  );
}
