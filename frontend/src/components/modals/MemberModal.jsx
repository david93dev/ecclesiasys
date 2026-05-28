import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { formatPhone } from "@/utils/formatPhone";

import { toast } from "sonner";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  status: "active",
};

export const MemberModal = ({ open, onClose, onSave, member }) => {
  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  // ✅ edição
  useEffect(() => {
    if (!open) return;

    if (member) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: member.name || "",

        email: member.email || "",

        phone: member.phone || "",

        birthDate: member.birthDate || "",

        status: member.status || "active",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [member, open]);

  if (!open) return null;

  // ✅ handle change
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

    const cleanPhone = form.phone.replace(/\D/g, "");

    // nome
    if (!form.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    // email
    if (!form.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    // telefone
    if (!cleanPhone) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Telefone inválido";
    }

    // data
    if (!form.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    }

    // status
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

    const cleanPhone = form.phone.replace(/\D/g, "");

    try {
      await onSave({
        name: form.name,

        email: form.email,

        phone: cleanPhone,

        birthDate: form.birthDate,

        status: form.status,
      });

      toast.success("Membro salvo com sucesso!");

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
              {member ? "Editar Membro" : "Novo Membro"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Gerencie informações do membro
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
          {/* GRID */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* NOME */}
            <div className="space-y-1.5">
              <Label>Nome</Label>

              <Input
                placeholder="Nome do membro"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-slate-100 p-5"
              />

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <Label>Email</Label>

              <Input
                type="email"
                placeholder="Digite o email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-slate-100 p-5"
              />

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* TELEFONE */}
            <div className="space-y-1.5">
              <Label>Telefone</Label>

              <Input
                placeholder="(83) 99999-9999"
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", formatPhone(e.target.value))
                }
                className="bg-slate-100 p-5"
              />

              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* DATA */}
            <div className="space-y-1.5">
              <Label>Data de nascimento</Label>

              <Input
                type="date"
                value={form.birthDate || ""}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="bg-slate-100 p-5"
              />

              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate}</p>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-1.5">
            <Label>Status</Label>

            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >
              <option value="active">Ativo</option>

              <option value="inactive">Inativo</option>
            </select>

            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
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
