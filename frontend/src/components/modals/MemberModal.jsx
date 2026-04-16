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

  useEffect(() => {
    if (member) {
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

  // ✅ TODOS obrigatórios
  const validate = () => {
    const newErrors = {};
    const cleanPhone = form.phone.replace(/\D/g, "");

    if (!form.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!cleanPhone) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Telefone inválido";
    }

    if (!form.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
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
            {member ? "Editar Membro" : "Novo Membro"}
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
          <div className="mb-4 rounded bg-red-100 p-2 text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div className="space-y-1">
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

          {/* Email */}
          <div className="space-y-1">
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

          {/* Telefone */}
          <div className="space-y-1">
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

          {/* Data nascimento */}
          <div className="space-y-1">
            <Label>Data de nascimento</Label>
            <Input
              type="date"
              value={form.birthDate || ""}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              className="bg-slate-100 p-5"
            />
            {errors.birthDate && (
              <p className="text-sm text-red-500">
                {errors.birthDate}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" className="bg-slate-900 hover:bg-slate-700">
              Salvar
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};