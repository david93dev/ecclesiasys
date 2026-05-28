import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

export const ContributionModal = ({
  open,
  onClose,
  onSave,
  contribution,
}) => {
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});

  // ✅ estado inicial derivado sem useEffect
  const initialForm = useMemo(
    () => ({
      memberId: contribution?.memberId || "",
      amount: contribution?.amount || "",
      type: contribution?.type || "tithe",
      date: contribution?.date
        ? contribution.date.split("T")[0]
        : "",
      note: contribution?.note || "",
    }),
    [contribution]
  );

  const [form, setForm] = useState(initialForm);

  // ✅ resetar formulário quando modal abrir
  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(initialForm);
    setErrors({});
  }, [open, initialForm]);

  // ✅ carregar membros
  useEffect(() => {
    if (!open) return;

    const fetchMembers = async () => {
      try {
        const res = await api.get("/member");
        setMembers(res.data);
      } catch {
        toast.error("Erro ao carregar membros");
      }
    };

    fetchMembers();
  }, [open]);

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

    if (!form.memberId) {
      newErrors.memberId = "Selecione um membro";
    }

    if (!form.amount) {
      newErrors.amount = "Valor é obrigatório";
    } else if (Number(form.amount) <= 0) {
      newErrors.amount = "Valor deve ser maior que zero";
    }

    if (!form.type) {
      newErrors.type = "Tipo é obrigatório";
    }

    if (!form.date) {
      newErrors.date = "Data é obrigatória";
    }

    if (!form.note.trim()) {
      newErrors.note = "Observação é obrigatória";
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
      await onSave(form);

      toast.success("Contribuição salva com sucesso!");
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {contribution ? "Editar" : "Nova"} Contribuição
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
          <div className="rounded bg-red-100 p-2 text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* MEMBRO */}
          <div>
            <select
              value={form.memberId}
              onChange={(e) =>
                handleChange("memberId", e.target.value)
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="">Selecione o membro</option>

              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>

            {errors.memberId && (
              <p className="text-sm text-red-500">
                {errors.memberId}
              </p>
            )}
          </div>

          {/* VALOR */}
          <div>
            <input
              type="number"
              placeholder="Valor da contribuição"
              value={form.amount}
              onChange={(e) =>
                handleChange("amount", e.target.value)
              }
              className="w-full border rounded-lg p-2"
            />

            {errors.amount && (
              <p className="text-sm text-red-500">
                {errors.amount}
              </p>
            )}
          </div>

          {/* TIPO */}
          <div>
            <select
              value={form.type}
              onChange={(e) =>
                handleChange("type", e.target.value)
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="tithe">Dízimo</option>
              <option value="offering">Oferta</option>
              <option value="missions">Missões</option>
            </select>

            {errors.type && (
              <p className="text-sm text-red-500">
                {errors.type}
              </p>
            )}
          </div>

          {/* DATA */}
          <div>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                handleChange("date", e.target.value)
              }
              className="w-full border rounded-lg p-2"
            />

            {errors.date && (
              <p className="text-sm text-red-500">
                {errors.date}
              </p>
            )}
          </div>

          {/* OBSERVAÇÃO */}
          <div>
            <textarea
              placeholder="Descreva a contribuição"
              value={form.note}
              onChange={(e) =>
                handleChange("note", e.target.value)
              }
              className="w-full border rounded-lg p-2"
            />

            {errors.note && (
              <p className="text-sm text-red-500">
                {errors.note}
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};