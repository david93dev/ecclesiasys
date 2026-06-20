import { NavLink } from "react-router-dom";
import { createElement } from "react";
import {
  CalendarDays,
  HandCoins,
  LayoutDashboard,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { isAdminRole } from "@/utils/roles";

const mainLinks = [
  { to: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { to: "/members", label: "Membros", icon: Users },
  { to: "/ministries", label: "Ministérios", icon: Workflow },
  { to: "/events", label: "Eventos", icon: CalendarDays },
  { to: "/contributions", label: "Contribuições", icon: HandCoins },
];

const linkClassName = ({ isActive }) =>
  `group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-amber-300/70 ${
    isActive
      ? "bg-white text-slate-950 shadow-sm"
      : "text-slate-300 hover:bg-white/8 hover:text-white"
  }`;

const NavigationLink = ({ to, label, icon }) => (
  <NavLink to={to} className={linkClassName}>
    {({ isActive }) => (
      <>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-md transition-colors ${
            isActive
              ? "bg-amber-100 text-amber-700"
              : "bg-white/5 text-slate-400 group-hover:text-amber-300"
          }`}
        >
          {createElement(icon, { className: "size-4.5" })}
        </span>
        <span>{label}</span>
        {isActive && <span className="ml-auto size-1.5 rounded-full bg-amber-500" />}
      </>
    )}
  </NavLink>
);

export const NavigateLinks = () => {
  const { user } = useAuth();

  return (
    <nav className="space-y-7 px-3 py-6" aria-label="Navegação principal">
      <div>
        <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Gestão
        </p>
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavigationLink key={link.to} {...link} />
          ))}
        </div>
      </div>

      {isAdminRole(user?.role) && (
        <div className="border-t border-white/10 pt-5">
          <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Administração
          </p>
          <NavigationLink to="/settings" label="Configurações" icon={Settings} />
        </div>
      )}
    </nav>
  );
};
