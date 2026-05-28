import { useMemo, useRef } from "react";

import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { EventCard } from "@/components/EventCard";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const EventsCalendar = ({ events, year, onEdit, onDelete }) => {
  const currentMonth = new Date().getMonth();

  const scrollRef = useRef(null);

  // ✅ agrupar eventos
  const groupedEvents = useMemo(() => {
    return months.map((month, index) => {
      const monthEvents = events.filter((e) => {
        const date = new Date(e.date);

        return date.getMonth() === index;
      });

      return {
        month,
        index,
        events: monthEvents,
      };
    });
  }, [events]);

  // ✅ scroll do carrossel
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const amount = window.innerWidth < 640 ? 320 : 520;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* TEXTOS */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Calendário de Eventos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Eventos organizados por mês • {year}
          </p>
        </div>

        {/* CONTROLES */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          {/* TOTAL */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <FiCalendar />
            {events.length} eventos
          </div>

          {/* BOTÕES */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:bg-slate-100 hover:shadow-md"
            >
              <FiChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:bg-slate-100 hover:shadow-md"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* CARROSSEL */}
      <div
        ref={scrollRef}
        className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {groupedEvents.map(({ month, index, events }) => {
          const isCurrent = currentMonth === index;

          return (
            <div
              key={month}
              className={`w-[88vw] flex-shrink-0 snap-center overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[420px] lg:w-[460px] xl:w-[500px] ${
                isCurrent
                  ? "border-slate-400 ring-2 ring-slate-200"
                  : "border-slate-200"
              } `}
            >
              {/* HEADER CARD */}
              <div
                className={`flex items-center justify-between px-4 py-4 sm:px-5 ${
                  isCurrent ? "bg-slate-900 text-white" : "bg-slate-50"
                } `}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {/* BADGE */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                      isCurrent ? "bg-white/20" : "bg-slate-200 text-slate-700"
                    } `}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* INFO */}
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold sm:text-lg">
                      {month}
                    </h3>

                    <p
                      className={`text-xs ${
                        isCurrent ? "text-white/70" : "text-slate-500"
                      } `}
                    >
                      {events.length} evento
                      {events.length !== 1 && "s"}
                    </p>
                  </div>
                </div>

                <FiCalendar
                  className={`shrink-0 text-lg ${
                    isCurrent ? "text-white/70" : "text-slate-400"
                  } `}
                />
              </div>

              {/* EVENTOS */}
              <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto p-4 sm:p-5">
                {events.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                    <FiCalendar className="mb-3 text-4xl text-slate-300" />

                    <p className="text-sm text-slate-500">Nenhum evento</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
