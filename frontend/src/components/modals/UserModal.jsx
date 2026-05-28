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

export const UserModal = ({
  open,
  onClose,
  onSave,
  user,
}) => {

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

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

    // senha obrigatória apenas no create
    if (!user && !form.password.trim()) {

      newErrors.password = "Senha é obrigatória";
    }

    // tamanho senha
    if (
      form.password &&
      form.password.length < 6
    ) {

      newErrors.password =
        "Senha deve ter pelo menos 6 caracteres";
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

      toast.success(
        user
          ? "Usuário atualizado"
          : "Usuário criado"
      );

      onClose();

    } catch (err) {

      console.error(err);

      if (err.response?.data?.errors) {

        setErrors({
          general: err.response.data.errors.join(", "),
        });

      } else {

        setErrors({
          general:
            err.response?.data?.message ||
            "Erro ao salvar usuário",
        });
      }

      toast.error(
        err.response?.data?.message ||
        "Erro ao salvar usuário"
      );
    }
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-semibold">

            {user
              ? "Editar Usuário"
              : "Novo Usuário"}

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

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* NOME */}
          <div className="space-y-1">

            <Label>Nome</Label>

            <Input
              placeholder="Nome do usuário"
              value={form.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
              className="bg-slate-100 p-5"
            />

            {errors.name && (

              <p className="text-sm text-red-500">

                {errors.name}

              </p>
            )}

          </div>

          {/* EMAIL */}
          <div className="space-y-1">

            <Label>Email</Label>

            <Input
              type="email"
              placeholder="Digite o email"
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              className="bg-slate-100 p-5"
            />

            {errors.email && (

              <p className="text-sm text-red-500">

                {errors.email}

              </p>
            )}

          </div>

          {/* SENHA */}
          <div className="space-y-1">

            <Label>
              Senha {user && "(opcional)"}
            </Label>

            <Input
              type="password"
              placeholder={
                user
                  ? "Digite para alterar a senha"
                  : "Digite a senha"
              }
              value={form.password}
              onChange={(e) =>
                handleChange("password", e.target.value)
              }
              className="bg-slate-100 p-5"
            />

            {errors.password && (

              <p className="text-sm text-red-500">

                {errors.password}

              </p>
            )}

          </div>

          {/* ROLE */}
          <div className="space-y-1">

            <Label>Nível de acesso</Label>

            <select
              value={form.role}
              onChange={(e) =>
                handleChange("role", e.target.value)
              }
              className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2"
            >

              <option value="user">
                Usuário
              </option>

              <option value="admin">
                Administrador
              </option>

            </select>

            {errors.role && (

              <p className="text-sm text-red-500">

                {errors.role}

              </p>
            )}

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-700"
            >
              Salvar
            </Button>

          </div>

        </form>
      </div>
    </div>
  );
};