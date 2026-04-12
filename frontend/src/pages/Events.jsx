import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { EventModal } from "@/components/modals/EventModal";
import { EventsCalendar } from "@/components/EventsCalendar";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { api } from "@/services/api";
import { toast } from "sonner";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 🔥 BUSCAR EVENTOS
  const fetchEvents = async () => {
    try {
      const res = await api.get("/event");

      const formatted = res.data.map((e) => ({
        id: e._id,
        title: e.title,
        description: e.description,
        date: e.date,
        responsible: e.responsible,
        participants: e.participants || [],
      }));

      setEvents(formatted);
    } catch {
      toast.error("Erro ao carregar eventos");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 💾 SALVAR (CREATE + UPDATE)
  const handleSave = async (newEvent) => {
    try {
      const payload = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        responsible: newEvent.responsibleId,
        participants: newEvent.participants || [],
      };

      if (selectedEvent) {
        // ✏️ UPDATE
        await api.put(`/event/${selectedEvent.id}`, payload);
        toast.success("Evento atualizado com sucesso");
      } else {
        // 🆕 CREATE
        await api.post("/event", payload);
        toast.success("Evento criado com sucesso");
      }

      fetchEvents();
      setOpenModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || "Erro ao salvar evento");
    }
  };

  // ✏️ EDITAR
  const handleEdit = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  // ❌ DELETAR
  const handleDelete = (id) => {
    toast("Deseja excluir este evento?", {
      action: {
        label: "Excluir",
        onClick: async () => {
          try {
            await api.delete(`/event/${id}`);
            toast.success("Evento excluído com sucesso");
            fetchEvents();
          } catch {
            toast.error("Erro ao deletar evento");
          }
        },
      },
      cancel: {
        label: "Cancelar",
      },
    });
  };

  // 🔍 FILTROS
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
        onClick={() => {
          setSelectedEvent(null);
          setOpenModal(true);
        }}
      />

      {/* EVENTOS DO MÊS */}
      <div>
        <h2 className="text-xl font-semibold capitalize">
          Eventos desse mês: {monthName}
        </h2>
      </div>

      {currentMonthEvents.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          Nenhum evento cadastrado
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentMonthEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* PAGINAÇÃO */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentYear((p) => p - 1)}
          className="transition hover:scale-110"
        >
          <MdKeyboardArrowLeft size={36} />
        </button>

        <h2 className="text-lg font-semibold">{currentYear}</h2>

        <button
          onClick={() => setCurrentYear((p) => p + 1)}
          className="transition hover:scale-110"
        >
          <MdKeyboardArrowRight size={36} />
        </button>
      </div>

      {/* CALENDÁRIO */}
      <EventsCalendar
        events={eventsByYear}
        year={currentYear}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      <EventModal
        open={openModal}
        event={selectedEvent}
        onClose={() => {
          setOpenModal(false);
          setSelectedEvent(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};
