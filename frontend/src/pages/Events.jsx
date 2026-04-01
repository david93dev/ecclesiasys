import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { EventModal } from "@/components/modals/EventModal";
import { EventsCalendar } from "@/components/EventsCalendar";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleSave = (newEvent) => {
    setEvents((prev) => [...prev, { ...newEvent, _id: Date.now() }]);
  };

  const today = new Date();

  const eventsByYear = events.filter((event) => {
    const date = new Date(event.date);
    return date.getFullYear() === currentYear;
  });

  const currentMonthEvents = eventsByYear.filter((event) => {
    const date = new Date(event.date);
    return date.getMonth() === today.getMonth();
  });

  const monthName = today.toLocaleString("pt-BR", {
    month: "long",
  });

  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Eventos"
        description="Gerencie os eventos da igreja"
        buttonLabel="Novo Evento"
        onClick={() => setOpenModal(true)}
      />

      {/* PAGINAÇÃO POR ANO */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentYear((prev) => prev - 1)}
          className="rounded bg-gray-100 px-3 py-1 hover:scale-110"
        >
          <FaArrowAltCircleLeft size={36}/>
        </button>

        <h2 className="text-lg font-semibold">{currentYear}</h2>

        <button
          onClick={() => setCurrentYear((prev) => prev + 1)}
          className="rounded bg-gray-100 px-3 py-1 hover:scale-110"
        >
          <FaArrowAltCircleRight size={36} />
        </button>
      </div>

      {/* EVENTOS DO MÊS */}
      <div>
        <h2 className="text-xl font-semibold capitalize">
          Eventos desse mês: {monthName}
        </h2>
        <p className="text-sm text-gray-500">
          Eventos programados para este mês
        </p>
      </div>

      {currentMonthEvents.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          Nenhum evento cadastrado para este mês
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentMonthEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {/* CALENDÁRIO */}
      <EventsCalendar events={eventsByYear} year={currentYear} />

      <EventModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};
