import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { ContributionModal } from "@/components/modals/ContributionModal";
import { api } from "@/services/api";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatCurrency";
import { EmptyState } from "@/components/EmptyState";

export const Contributions = () => {
  const [contributions, setContributions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);

  // 🔥 BUSCAR DADOS
  const fetchContributions = async () => {
    try {
      const res = await api.get("/contribution");

      const formatted = res.data.map((c) => ({
        id: c._id,
        memberName: c.member?.name || "—",
        memberId: c.member?._id,
        amount: c.amount,
        type: c.type,
        date: c.date ? c.date.split("T")[0] : "",
        note: c.note || "",
      }));

      setContributions(formatted);
    } catch {
      toast.error("Erro ao carregar contribuições");
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // 🆕 NOVO
  const handleNew = () => {
    setSelectedContribution(null);
    setOpenModal(true);
  };

  // ✏️ EDITAR
  const handleEdit = (c) => {
    setSelectedContribution(c);
    setOpenModal(true);
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;

    try {
      await api.delete(`/contribution/${id}`);
      toast.success("Contribuição excluída");
      fetchContributions();
    } catch {
      toast.error("Erro ao excluir");
    }
  };
  
  // 💾 SALVAR
  const handleSave = async (data) => {
    try {
      const payload = {
        member: data.memberId,
        amount: Number(data.amount),
        type: data.type,
        date: data.date,
        note: data.note,
      };

      if (selectedContribution) {
        await api.put(`/contribution/${selectedContribution.id}`, payload);
        toast.success("Atualizado com sucesso");
      } else {
        await api.post("/contribution", payload);
        toast.success("Criado com sucesso");
      }

      fetchContributions();
      setOpenModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao salvar");
    }
  };

  // 📊 COLUNAS
  const columns = [
    { key: "memberName", label: "Membro" },

    {
      key: "amount",
      label: "Valor",
      render: (row) => formatCurrency(row.amount),
    },

    {
      key: "type",
      label: "Tipo",
      render: (row) => {
        const map = {
          tithe: "Dízimo",
          offering: "Oferta",
          missions: "Missões",
        };
        return map[row.type];
      },
    },

    {
      key: "date",
      label: "Data",
      render: (row) => new Date(row.date).toLocaleDateString("pt-BR"),
    },

    {
      key: "actions",
      label: "Ações",
      render: (row) => (
        <div className="flex gap-3">
          <button onClick={() => handleEdit(row)}>
            <FiEdit />
          </button>
          <button onClick={() => handleDelete(row.id)}>
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  // 🔍 FILTRO
  const filtered = contributions.filter((c) => {
    return c.memberName.toLowerCase().includes(searchInput.toLowerCase());
  });

  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Contribuições"
        description="Gerencie dízimos e ofertas"
        buttonLabel="Nova Contribuição"
        onClick={handleNew}
      />

      <SearchFilter
        value={searchInput}
        onChange={setSearchInput}
        placeholder="Buscar por membro..."
      />

      {filtered.length ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <EmptyState />
      )}

      <ContributionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        contribution={selectedContribution}
      />
    </div>
  );
};
