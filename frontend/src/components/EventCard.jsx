import { FiCalendar, FiUser, FiUsers, FiEdit, FiTrash2 } from "react-icons/fi";

export const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {event.title}
        </h3>

        <div className="flex gap-2 text-gray-500">
          <button
            onClick={() => onEdit(event)}
            className="hover:text-amber-600"
          >
            <FiEdit size={18} />
          </button>

          <button
            onClick={() => onDelete(event.id)}
            className="hover:text-red-600"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <p className="text-sm text-gray-500 line-clamp-2">
        {event.description}
      </p>

      {/* INFO */}
      <div className="space-y-2 text-sm text-gray-700">

        <div className="flex items-center gap-2">
          <FiCalendar size={16} />
          <span>
            {event.date
              ? new Date(event.date).toLocaleDateString("pt-BR")
              : "Sem data"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FiUser size={16} />
          <span>
            {event.responsible?.name || "Sem responsável"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FiUsers size={16} />
          <span>
            {event.participants?.length || 0} participantes
          </span>
        </div>

      </div>
    </div>
  );
};