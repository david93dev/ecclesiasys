import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { toast } from "sonner";

const initialForm = {
  _id: "",
  name: "",
  email: "",
  password: "",
  role: "user",
};

export const UserModal = ({ open, onClose, onSave, user }) => {
  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  // ✅ preencher form
  useEffect(() => {
    if (!open) return;

    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        _id: user._id || "",

        name: user.name || "",

        email: user.email || "",

        password: "",

        role: user.role || "user",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [user, open]);

  if (!open) return null;

  // ✅ alterar campos
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

    // senha obrigatória apenas criação
    if (!user && !form.password.trim()) {
      newErrors.password = "Senha é obrigatória";
    }

    // tamanho senha
    if (form.password && form.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    // role
    if (!form.role) {
      newErrors.role = "Cargo é obrigatório";
    }

    return newErrors;
  };

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error("Corrija os campos");

      return;
    }

    try {
      await onSave({
        _id: form._id,

        name: form.name,

        email: form.email,

        password: form.password,

        role: form.role,
      });

      toast.success(user ? "Usuário atualizado" : "Usuário criado");

      onClose();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        setErrors({
          general: err.response.data.errors.join(", "),
        });
      } else {
        setErrors({
          general: err.response?.data?.message || "Erro ao salvar usuário",
        });
      }

      toast.error(err.response?.data?.message || "Erro ao salvar usuário");
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
              {user ? "Editar Usuário" : "Novo Usuário"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Gerencie permissões e acesso
            </p>
          </div>

          {/* FECHAR */}
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
                placeholder="Nome do usuário"
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

            {/* SENHA */}
            <div className="space-y-1.5">
              <Label>Senha {user && "(opcional)"}</Label>

              <Input
                type="password"
                placeholder={
                  user ? "Digite para alterar a senha" : "Digite a senha"
                }
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="bg-slate-100 p-5"
              />

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* ROLE */}
            <div className="space-y-1.5">
              <Label>Nível de acesso</Label>

              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="user">Usuário</option>

                <option value="admin">Administrador</option>
              </select>

              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
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
