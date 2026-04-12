import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

export const EventModal = ({ open, onClose, onSave, event }) => {
  const [members, setMembers] = useState([]);

  const initialForm = {
    title: "",
    description: "",
    date: "",
    responsibleId: "",
    participants: [],
  };

  const [form, setForm] = useState(initialForm);

  // 🔥 CARREGAR MEMBROS
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/member");
        setMembers(res.data);
      } catch {
        toast.error("Erro ao carregar membros");
      }
    };

    if (open) fetchMembers();
  }, [open]);

  // 🔥 PREENCHER FORM (EDIÇÃO)
  useEffect(() => {
    if (!open) return;

    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        date: event.date ? event.date.split("T")[0] : "",
        responsibleId: event.responsible?._id || "",
        participants: event.participants || [],
      });
    } else {
      setForm(initialForm);
    }
  }, [event, open]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 VALIDAÇÃO
    if (!form.title || !form.description || !form.date || !form.responsibleId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">

        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {event ? "Editar Evento" : "Novo Evento"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TÍTULO */}
          <input
            type="text"
            placeholder="Título"
            className="w-full rounded-lg border px-3 py-2"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          {/* DESCRIÇÃO */}
          <textarea
            placeholder="Descrição"
            className="w-full rounded-lg border px-3 py-2"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />

          {/* DATA */}
          <input
            type="date"
            className="w-full rounded-lg border px-3 py-2"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />

          {/* RESPONSÁVEL */}
          <select
            value={form.responsibleId}
            onChange={(e) => handleChange("responsibleId", e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            required
          >
            <option value="">Selecione um responsável</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
            >
              Salvar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};