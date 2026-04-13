import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

export const ContributionModal = ({ open, onClose, onSave, contribution }) => {
  const [members, setMembers] = useState([]);

  const initialForm = {
    memberId: "",
    amount: "",
    type: "tithe",
    date: "",
    note: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) return;

    const fetchMembers = async () => {
      const res = await api.get("/member");
      setMembers(res.data);
    };

    fetchMembers();

    if (contribution) {
      setForm({
        memberId: contribution.memberId,
        amount: contribution.amount,
        type: contribution.type,
        date: contribution.date,
        note: contribution.note,
      });
    } else {
      setForm(initialForm);
    }
  }, [open, contribution]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.memberId || !form.amount || !form.date) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

        <h2 className="text-lg font-semibold">
          {contribution ? "Editar" : "Nova"} Contribuição
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            value={form.memberId}
            onChange={(e) =>
              setForm({ ...form, memberId: e.target.value })
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

          <input
            type="number"
            placeholder="Valor"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="tithe">Dízimo</option>
            <option value="offering">Oferta</option>
            <option value="missions">Missões</option>
          </select>

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <textarea
            placeholder="Observação"
            value={form.note}
            onChange={(e) =>
              setForm({ ...form, note: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
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