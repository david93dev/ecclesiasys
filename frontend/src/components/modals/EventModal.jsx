import { useState } from "react";

export const EventModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    responsible: "",
    participants: [],
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        
        <h2 className="text-lg font-semibold mb-4">
          Novo Evento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Título"
            className="w-full border rounded-lg px-3 py-2"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Descrição"
            className="w-full border rounded-lg px-3 py-2"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2"
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Responsável"
            className="w-full border rounded-lg px-3 py-2"
            onChange={(e) =>
              setForm({ ...form, responsible: e.target.value })
            }
          />

          <div className="flex justify-end gap-2">
            <button onClick={onClose} type="button">
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};