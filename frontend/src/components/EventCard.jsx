export const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-5 border space-y-2">
      <h3 className="font-semibold">{event.title}</h3>

      <p className="text-sm text-gray-500">
        {event.description}
      </p>

      <p className="text-sm">
        📅 {new Date(event.date).toLocaleDateString()}
      </p>

      <p className="text-sm">
        👤 {event.responsible}
      </p>

      <p className="text-sm">
        👥 {event.participants?.length || 0} participantes
      </p>
    </div>
  );
};