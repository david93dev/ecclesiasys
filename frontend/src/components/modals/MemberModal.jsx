import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/utils/formatPhone";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  status: "active",
};

export const MemberModal = ({ open, onClose, onSave, member }) => {
  const [form, setForm] = useState(initialForm);

  // 🔥 carregar dados para edição
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
  }, [member]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanPhone = form.phone.replace(/\D/g, ""); // 👈 REMOVE TUDO QUE NÃO É NÚMERO

    if (!form.name || !cleanPhone) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }

    if (cleanPhone.length < 8) {
      toast.error("Telefone inválido");
      return;
    }

    console.log("FORM:", form);

    onSave({
      name: form.name,
      email: form.email,
      phone: cleanPhone, // 👈 ENVIA LIMPO
      birthDate: form.birthDate,
      status: form.status,
    });

    onClose();
  };

  if (!open) return null;

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input
              placeholder="Nome do membro"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-slate-100 p-5"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-slate-100 p-5"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-1">
            <Label>Telefone</Label>
            <Input
              placeholder="Telefone"
              value={form.phone}
              onChange={(e) =>
                handleChange("phone", formatPhone(e.target.value))
              }
              className="bg-slate-100 p-5"
              required
            />
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
