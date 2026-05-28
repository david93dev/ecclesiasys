import { FiCalendar, FiUser, FiUsers, FiEdit, FiTrash2 } from "react-icons/fi";

export const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* TOPO */}
      <div className="flex items-start justify-between gap-3 border-b bg-slate-50 p-4 sm:p-5">
        {/* TÍTULO */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-slate-800 sm:text-lg">
            {event.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {event.description || "Sem descrição"}
          </p>
        </div>

        {/* AÇÕES */}
        <div className="flex shrink-0 gap-2">
          {/* EDITAR */}
          <button
            onClick={() => onEdit(event)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-amber-50 hover:text-amber-600"
          >
            <FiEdit size={16} />
          </button>

          {/* DELETE */}
          <button
            onClick={() => onDelete(event.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:text-red-600"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="space-y-4 p-4 sm:p-5">
        {/* DATA */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
            <FiCalendar size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Data
            </p>

            <p className="truncate text-sm font-semibold text-slate-700">
              {event.date
                ? new Date(event.date).toLocaleDateString("pt-BR")
                : "Sem data"}
            </p>
          </div>
        </div>

        {/* RESPONSÁVEL */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
            <FiUser size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Responsável
            </p>

            <p className="truncate text-sm font-semibold text-slate-700">
              {event.responsible?.name || "Sem responsável"}
            </p>
          </div>
        </div>

        {/* PARTICIPANTES */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
            <FiUsers size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Participantes
            </p>

            <p className="text-sm font-semibold text-slate-700">
              {event.participants?.length || 0} participante
              {(event.participants?.length || 0) !== 1 && "s"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
