import { useState, useEffect } from "react";

export const MinistryModal = ({ open, onClose, ministry, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    leader: "",
    status: "ativo",
  });

  useEffect(() => {
    if (ministry) {
      setForm(ministry);
    } else {
      setForm({ name: "", leader: "", status: "ativo" });
    }
  }, [ministry]);

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
          {ministry ? "Editar Ministério" : "Novo Ministério"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Nome do ministério"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            placeholder="Responsável"
            value={form.leader}
            onChange={(e) =>
              setForm({ ...form, leader: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500"
            >
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