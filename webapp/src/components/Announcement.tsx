import { ShieldAlert } from "lucide-react";

export function Announcement() {
  return (
    <div className="bg-brand-600/90 text-white">
      <div className="mx-auto flex w-full max-w-8xl items-center gap-3 px-6 py-2 text-sm">
        <ShieldAlert size={18} className="hidden opacity-75 sm:block" />
        <p className="font-medium">
          Programa Vet Priority ativo em SP / RJ – motoristas com treinamento pós-cirúrgico e linha direta 24/7.
        </p>
      </div>
    </div>
  );
}
