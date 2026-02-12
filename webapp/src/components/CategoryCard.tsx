import type { RideCategory } from "../types";
import { animalsPerCategory } from "../data/mock";

interface Props {
  category: RideCategory;
  description: string;
  badge?: string;
  priceFrom: string;
}

const categoryName: Record<RideCategory, string> = {
  BASIC: "PetGo Básico",
  PLUS: "PetGo Plus",
  SUV: "Pet SUV",
  VET: "Pet Vet Priority",
};

export function CategoryCard({ category, description, badge, priceFrom }: Props) {
  const spec = animalsPerCategory[category];
  return (
    <div className="gradient-border flex flex-col justify-between rounded-3xl bg-white px-5 py-6 shadow-card">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="font-display text-lg text-slate-900">{categoryName[category]}</p>
          {badge && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{badge}</span>}
        </div>
        <p className="text-sm text-slate-500">{description}</p>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Capacidade</p>
          <p>{spec}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">a partir de</p>
          <p className="text-lg font-semibold text-brand-700">{priceFrom}</p>
        </div>
        <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-brand-500">
          Selecionar
        </button>
      </div>
    </div>
  );
}
