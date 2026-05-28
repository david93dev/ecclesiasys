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

  // ✅ carregar membros
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

  // ✅ edição
  useEffect(() => {
    if (!open) return;

    if (ministry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // ✅ change
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // ✅ validação
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

  // ✅ submit
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
        setErrors({
          general: err.response.data.errors,
        });

        toast.error("Erro de validação");
      } else if (err.response?.data?.message) {
        setErrors({
          general: err.response.data.message,
        });

        toast.error(err.response.data.message);
      } else {
        setErrors({
          general: "Erro inesperado ao salvar",
        });

        toast.error("Erro inesperado");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-6 backdrop-blur-[2px]">
      {/* MODAL */}
      <div className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              {ministry ? "Editar Ministério" : "Novo Ministério"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Gerencie informações do ministério
            </p>
          </div>

          {/* fechar */}
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 transition hover:bg-slate-100 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* ERRO */}
        {errors.general && (
          <div className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NOME */}
          <div className="space-y-1.5">
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

          {/* DESCRIÇÃO */}
          <div className="space-y-1.5">
            <Label>Descrição</Label>

            <textarea
              placeholder="Descrição do ministério"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-30 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />

            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* GRID */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* RESPONSÁVEL */}
            <div className="space-y-1.5">
              <Label>Responsável</Label>

              <select
                value={form.leader}
                onChange={(e) => handleChange("leader", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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

            {/* STATUS */}
            <div className="space-y-1.5">
              <Label>Status</Label>

              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="ativo">Ativo</option>

                <option value="inativo">Inativo</option>
              </select>

              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-700 sm:w-auto"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
