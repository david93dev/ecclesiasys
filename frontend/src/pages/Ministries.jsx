import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MinistryModal } from "@/components/modals/MinistryModal";
import { api } from "@/services/api";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";

export const Ministries = () => {
  const [ministries, setMinistries] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);

  // 🔥 BUSCAR DADOS DO BACK
  const fetchMinistries = async () => {
    try {
      const response = await api.get("/ministry");

      const formatted = response.data.map((m) => ({
        id: m._id,
        name: m.name,
        description: m.description,
        leaderId: m.leader?._id,
        leaderName: m.leader?.name || "Sem líder",
        status: m.status === "active" ? "ativo" : "inativo",
      }));

      setMinistries(formatted);
    } catch (error) {
      toast.error("Erro ao carregar ministérios", error);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  // 🆕 NOVO
  const handleNew = () => {
    setSelectedMinistry(null);
    setOpenModal(true);
  };

  // ✏️ EDITAR
  const handleEdit = (ministry) => {
    setSelectedMinistry(ministry);
    setOpenModal(true);
  };

  // 💾 SALVAR (CREATE / UPDATE)
  const handleSave = async (newData) => {
    try {
      if (!newData.leaderId) {
        toast.error("Selecione um líder");
        return;
      }
      
      const payload = {
        name: newData.name,
        description: newData.description,
        leader: newData.leaderId,
        // members: newData.members || [],
        status: newData.status === "ativo" ? "active" : "inactive",
      };

      if (selectedMinistry) {
        await api.put(`/ministry/${selectedMinistry.id}`, payload);
        toast.success("Ministério atualizado com sucesso");
      } else {
        await api.post("/ministry", payload);
        toast.success("Ministério criado com sucesso");
      }

      fetchMinistries();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro real:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Erro ao salvar ministério");
    }
  };

  // ❌ DELETAR (opcional)
  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir?")) return;

    try {
      await api.delete(`/ministry/${id}`);
      toast.success("Ministério excluído com sucesso");
      fetchMinistries();
    } catch (error) {
      toast.error("Erro ao deletar ministério", error);
    }
  };

  // 📊 COLUNAS
  const columns = [
    {
      key: "name",
      label: "Ministério",
    },
    {
      key: "leaderName",
      label: "Responsável",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.status === "ativo"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (row) => (
        <div className="flex gap-3 text-gray-600">
          <button
            onClick={() => handleEdit(row)}
            className="hover:text-amber-600"
          >
            <FiEdit size={18} />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="hover:text-red-600"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // 🔍 FILTRO
  const filtered = ministries.filter((m) => {
    const matchName = m.name.toLowerCase().includes(searchInput.toLowerCase());

    const matchStatus = searchSelect === "" || m.status === searchSelect;

    return matchName && matchStatus;
  });

  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Gestão de Ministérios"
        description="Cadastre e gerencie os ministérios da igreja"
        buttonLabel="Novo Ministério"
        onClick={handleNew}
      />

      <SearchFilter
        value={searchInput}
        onChange={setSearchInput}
        status={searchSelect}
        onStatusChange={setSearchSelect}
        placeholder="Digite o nome do ministério..."
        showStatus
      />

      {filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <EmptyState />
      )}

      <MinistryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        ministry={selectedMinistry}
        onSave={handleSave}
      />
    </div>
  );
};
