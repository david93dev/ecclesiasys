import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MemberModal = ({ open, onClose, onSave, member }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    status: "active",
  });

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
      setForm({
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        status: "active",
      });
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

    const payload = {
      ...form,
      _id: member?._id,
      createdAt: member?.createdAt || new Date(),
    };

    onSave(payload);
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
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-slate-100 p-5"
            />
          </div>

          {/* Data nascimento */}
          <div className="space-y-1">
            <Label>Data de nascimento</Label>
            <Input
              type="date"
              value={form.birthDate}
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
              className="w-full rounded-md border border-slate-300 bg-slate-100 py-2 px-3"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className='cursor-pointer'
            >
              Cancelar
            </Button>

            <Button className="bg-slate-900 hover:bg-slate-700 cursor-pointer" type="submit">
              Salvar
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};