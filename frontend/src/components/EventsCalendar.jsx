import { useState } from "react";
import { EventCard } from "@/components/EventCard";

const months = [
  "Janeiro","Fevereiro","Março","Abril",
  "Maio","Junho","Julho","Agosto",
  "Setembro","Outubro","Novembro","Dezembro"
];

export const EventsCalendar = ({ events, year }) => {
  const currentMonth = new Date().getMonth();
  const [openMonth, setOpenMonth] = useState(currentMonth);

  const toggleMonth = (index) => {
    setOpenMonth(openMonth === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow border space-y-3">

      <h2 className="font-semibold text-lg">
        Calendário {year}
      </h2>

      {months.map((month, index) => {
        const monthEvents = events.filter((e) => {
          const date = new Date(e.date);
          return date.getMonth() === index;
        });

        const isOpen = openMonth === index;

        return (
          <div key={index} className="border rounded-xl overflow-hidden">

            <button
              onClick={() => toggleMonth(index)}
              className={`w-full flex justify-between px-4 py-3 ${
                index === currentMonth
                  ? "bg-primary/10"
                  : "bg-gray-50"
              }`}
            >
              <span>{month}</span>
              <span className="text-sm text-gray-500">
                {monthEvents.length} eventos
              </span>
            </button>

            {isOpen && (
              <div className="p-4 space-y-4">

                {monthEvents.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    Nenhum evento neste mês
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {monthEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};