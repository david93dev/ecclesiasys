import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

    onSave({
      name: form.name,
      description: form.description,
      leaderId: form.leader,
      status: form.status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {ministry ? "Editar Ministério" : "Novo Ministério"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input
              placeholder="Nome do ministério"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-slate-100 p-5"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Input
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-slate-100 p-5"
            />
          </div>

          {/* Responsável */}
          <div className="space-y-1">
            <Label>Responsável</Label>
            <select
              value={form.leader}
              onChange={(e) => handleChange("leader", e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-slate-100 py-2 px-3"
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
          <div className="space-y-1">
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-slate-100 py-2 px-3"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-700 cursor-pointer"
            >
              Salvar
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};