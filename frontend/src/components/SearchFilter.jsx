import { GoSearch } from "react-icons/go";

export const SearchFilter = ({
  value,
  onChange,
  status,
  onStatusChange,
  placeholder = "Digite para buscar...",
  showStatus = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* BUSCA */}
        <div className="flex w-full flex-col gap-1.5">
          <label className="text-sm font-semibold text-black/60">
            Buscar por nome
          </label>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1 transition-all duration-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200">
            <GoSearch size={18} className="shrink-0 text-black/40" />

            <input
              type="text"
              placeholder={placeholder}
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-black/40 sm:text-base"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>

        {/* STATUS */}
        {showStatus && (
          <div className="flex w-full flex-col gap-1.5 lg:w-56">
            <label className="text-sm font-semibold text-black/60">
              Status
            </label>

            <select
              className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 sm:text-base"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">Todos</option>

              <option value="active">Ativo</option>

              <option value="inactive">Inativo</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
