import { Link } from "react-router-dom";

export function Footer() {
  const items = ["LGPD & privacidade", "Centro de segurança", "Programa de motoristas", "Parcerias clínicas"];
  return (
    <footer className="mt-16 border-t border-white/60 bg-white/70 py-8 text-sm text-slate-500 backdrop-blur">
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-slate-700">GoPet Segurança Animal</p>
          <p className="text-xs">© {new Date().getFullYear()} GoPet Transport. Todos os direitos reservados.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          {items.map((label) => (
            <Link key={label} to="/support" className="hover:text-brand-600">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
