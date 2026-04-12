import { useState, useEffect } from "react";
import { api } from "@/services/api";

const initialForm = {
  name: "",
  description: "",
  leader: "",
  status: "ativo",
};

export const MinistryModal = ({ open, onClose, ministry, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [members, setMembers] = useState([]);

  // 🔥 carregar membros (para selecionar líder)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/member");
        setMembers(res.data);
      } catch (err) {
        console.error("Erro ao carregar membros", err);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (!open) return;

    if (ministry) {
      setForm({
        name: ministry.name || "",
        description: ministry.description || "",
        leader: ministry.leaderId || "", 
        status: ministry.status || "ativo",
      });
    } else {
      setForm({
        name: "",
        description: "",
        leader: "",
        status: "ativo",
      });
    }
  }, [ministry, open]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 envia no formato correto
    onSave({
      name: form.name,
      description: form.description,
      leaderId: form.leader,
      status: form.status,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold">
          {ministry ? "Editar Ministério" : "Novo Ministério"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="text-sm text-gray-600">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Descrição</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            />
          </div>

          {/* Leader (ID) */}
          <div>
            <label className="text-sm text-gray-600">Responsável</label>
            <select
              value={form.leader}
              onChange={(e) => handleChange("leader", e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            >
              <option value="">Selecione um líder</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-primary rounded-lg px-4 py-2 text-white"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
