import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";

export const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-center">

      <h1 className="text-8xl font-extrabold text-slate-800">
        404
      </h1>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-700">
          Página não encontrada
        </h2>

        <p className="text-sm text-slate-500">
          A página que você tentou acessar não existe ou foi movida.
        </p>
      </div>

      <NavLink
        to="/dashboard"
        className="flex items-center gap-2 rounded-md bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        <LuLayoutDashboard size={18} />
        Voltar ao Dashboard
      </NavLink>

    </div>
  );
};