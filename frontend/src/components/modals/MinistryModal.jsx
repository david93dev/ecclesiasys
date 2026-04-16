import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialForm = {
  name: "",
  description: "",
  leader: "",
  status: "ativo",
};

export const MinistryModal = ({ open, onClose, ministry, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});

  // 🔥 carregar membros
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/member");
        setMembers(res.data);
      } catch (err) {
        console.error("Erro ao carregar membros", err);
        toast.error("Erro ao carregar membros");
      }
    };

    fetchMembers();
  }, []);

  // 🔥 carregar dados edição
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
      setForm(initialForm);
    }

    setErrors({});
  }, [ministry, open]);

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

  // ✅ validação frontend
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!form.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!form.leader) {
      newErrors.leader = "Selecione um responsável";
    }

    if (!form.status) {
      newErrors.status = "Status é obrigatório";
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
      await onSave({
        name: form.name,
        description: form.description,
        leaderId: form.leader,
        status: form.status,
      });

      toast.success("Ministério salvo com sucesso!");
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

        {/* 🔥 erro geral */}
        {errors.general && (
          <div className="mb-4 rounded bg-red-100 p-2 text-red-700">
            {errors.general}
          </div>
        )}

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
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Input
              placeholder="Descrição do ministério"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-slate-100 p-5"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description}
              </p>
            )}
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
            {errors.leader && (
              <p className="text-sm text-red-500">{errors.leader}</p>
            )}
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
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
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