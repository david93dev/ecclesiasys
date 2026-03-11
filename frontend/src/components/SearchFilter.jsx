import { GoSearch } from "react-icons/go";

export const SearchFilter = ({
  value,
  onChange,
  status,
  onStatusChange,
  placeholder = "Digite para buscar...",
}) => {
  return (
    <div className="rounded-md bg-white p-5 shadow">
      <div className="flex items-end gap-4">

        {/* Campo busca */}
        <div className="flex w-full flex-col gap-1">
          <label className="text-sm font-semibold text-black/60">
            Buscar por nome
          </label>

          <div className="flex items-center gap-2 rounded-md bg-slate-200 px-3">
            <GoSearch size={20} className="text-black/50" />

            <input
              type="text"
              placeholder={placeholder}
              className="w-full bg-transparent py-2 outline-none"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>

        {/* Select */}
        <div className="flex w-48 flex-col gap-1">
          <label className="text-sm font-semibold text-black/60">
            Status
          </label>

          <select
            className="rounded-md bg-slate-200 px-4 py-2"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

      </div>
    </div>
  );
};