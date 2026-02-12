import { Link, NavLink } from "react-router-dom";
import { PawPrint } from "lucide-react";
import clsx from "classnames";

const routes = [
  { label: "Visão Geral", to: "/" },
  { label: "Tutor", to: "/tutor" },
  { label: "Motorista", to: "/driver" },
  { label: "Cadastro Motorista", to: "/driver/apply" },
  { label: "Admin", to: "/admin" },
  { label: "Suporte", to: "/support" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/80 backdrop-blur-xl shadow-soft">
      <div className="mx-auto flex w-full max-w-8xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-brand-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <PawPrint size={26} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold leading-tight">GoPet</p>
            <p className="text-xs text-slate-500">Transporte pet-friendly</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
          {routes.map((route) => (
            <NavLink
              key={route.to}
              to={route.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-full px-4 py-2 transition-colors",
                  isActive ? "bg-brand-600 text-white shadow-card" : "text-slate-600 hover:bg-slate-100",
                )
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/tutor"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
          >
            App Tutor
          </Link>
          <Link
            to="/driver"
            className="hidden rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-brand-500 md:block"
          >
            App Motorista
          </Link>
          <Link
            to="/driver/apply"
            className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            Seja motorista
          </Link>
        </div>
      </div>
    </header>
  );
}
