import { useEffect, useMemo, useState } from "react";

import { api } from "@/services/api";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

export const ContributionModal = ({ open, onClose, onSave, contribution }) => {
  const [members, setMembers] = useState([]);

  const [errors, setErrors] = useState({});

  // ✅ estado inicial
  const initialForm = useMemo(
    () => ({
      memberId: contribution?.memberId || "",

      amount: contribution?.amount || "",

      type: contribution?.type || "tithe",

      date: contribution?.date ? contribution.date.split("T")[0] : "",

      note: contribution?.note || "",
    }),
    [contribution],
  );

  const [form, setForm] = useState(initialForm);

  // ✅ resetar formulário
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
              {contribution ? "Editar Contribuição" : "Nova Contribuição"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Gerencie informações financeiras
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
            {/* MEMBRO */}
            <div className="space-y-1.5">
              <Label>Membro</Label>

              <select
                value={form.memberId}
                onChange={(e) => handleChange("memberId", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Selecione o membro</option>

                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              {errors.memberId && (
                <p className="text-sm text-red-500">{errors.memberId}</p>
              )}
            </div>

            {/* VALOR */}
            <div className="space-y-1.5">
              <Label>Valor</Label>

              <Input
                type="number"
                placeholder="Valor da contribuição"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="bg-slate-100 p-5"
              />

              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* TIPO */}
            <div className="space-y-1.5">
              <Label>Tipo</Label>

              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="tithe">Dízimo</option>

                <option value="offering">Oferta</option>

                <option value="missions">Missões</option>
              </select>

              {errors.type && (
                <p className="text-sm text-red-500">{errors.type}</p>
              )}
            </div>

            {/* DATA */}
            <div className="space-y-1.5">
              <Label>Data</Label>

              <Input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="bg-slate-100 p-5"
              />

              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>
          </div>

          {/* OBSERVAÇÃO */}
          <div className="space-y-1.5">
            <Label>Observação</Label>

            <textarea
              placeholder="Descreva a contribuição"
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />

            {errors.note && (
              <p className="text-sm text-red-500">{errors.note}</p>
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
