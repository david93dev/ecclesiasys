import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

export const EventModal = ({ open, onClose, onSave, event }) => {
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});

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

    setErrors({});
  }, [event, open]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // limpa erro ao digitar
    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // ✅ validação
  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!form.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!form.date) {
      newErrors.date = "Data é obrigatória";
    }

    if (!form.responsibleId) {
      newErrors.responsibleId = "Selecione um responsável";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Corrija os campos obrigatórios");
      return;
    }

    setErrors({});

    try {
      await onSave(form);

      toast.success("Evento salvo com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro ao salvar:", err);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        toast.error("Erro de validação");
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
        toast.error(err.response.data.message);
      } else {
        setErrors({ general: "Erro inesperado ao salvar" });
        toast.error("Erro inesperado");
      }
    }
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

        {/* ERRO GERAL */}
        {errors.general && (
          <div className="mb-3 rounded bg-red-100 p-2 text-red-700">
            {errors.general}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TÍTULO */}
          <div>
            <input
              type="text"
              placeholder="Título do evento"
              className="w-full rounded-lg border px-3 py-2"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <textarea
              placeholder="Descreva o evento"
              className="w-full rounded-lg border px-3 py-2"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* DATA */}
          <div>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* RESPONSÁVEL */}
          <div>
            <select
              value={form.responsibleId}
              onChange={(e) =>
                handleChange("responsibleId", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Selecione um responsável</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
            {errors.responsibleId && (
              <p className="text-sm text-red-500">
                {errors.responsibleId}
              </p>
            )}
          </div>

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