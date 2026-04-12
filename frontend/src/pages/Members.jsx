import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { MemberModal } from "@/components/modals/MemberModal";
import { api } from "@/services/api";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";
import { formatPhone } from "@/utils/formatPhone";

export const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // 🔥 BUSCAR DO BACKEND
  const fetchMembers = async () => {
    try {
      const response = await api.get("/member");

      const formatted = response.data.map((m) => ({
        id: m._id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        birthDate: m.birthDate ? m.birthDate.split("T")[0] : "",
        status: m.status, // 👈 já vem correto
      }));

      setMembers(formatted);
    } catch (error) {
      toast.error("Erro ao carregar membros");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 🆕 NOVO
  const handleNewMember = () => {
    setSelectedMember(null);
    setOpenModal(true);
  };

  // ✏️ EDITAR
  const handleEdit = (member) => {
    setSelectedMember(member);
    setOpenModal(true);
  };

  // 💾 SALVAR (CREATE / UPDATE)
  const handleSave = async (newData) => {
    try {
      if (!newData.name || !newData.email || !newData.phone) {
        toast.error("Nome, email e telefone são obrigatórios");
        return;
      }

      const payload = {
        name: newData.name,
        email: newData.email,
        phone: newData.phone.replace(/\D/g, ""), // 👈 LIMPA
        birthDate: newData.birthDate,
        status: newData.status,
      };

      if (selectedMember) {
        await api.put(`/member/${selectedMember.id}`, payload);
        toast.success("Membro atualizado com sucesso");
      } else {
        await api.post("/member", payload);
        toast.success("Membro criado com sucesso");
      }

      fetchMembers();
      setOpenModal(false);
    } catch (error) {
      console.error("ERRO BACK:", error.response?.data);
      toast.error(
        error.response?.data?.errors?.[0] ||
          error.response?.data?.message ||
          "Erro ao salvar membro",
      );
    }
  };

  // ❌ DELETAR
  const handleDelete = async (id) => {
    try {
      await api.delete(`/member/${id}`);
      toast.success("Membro excluído com sucesso");
      fetchMembers();
    } catch {
      toast.error("Erro ao deletar membro");
    }
  };

  // 📊 COLUNAS
  const columns = [
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    {
      key: "phone",
      label: "Telefone",
      render: (row) => formatPhone(row.phone),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status === "active" ? "ativo" : "inativo"}
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
  const filteredMembers = members.filter((member) => {
    const matchName = member.name
      .toLowerCase()
      .includes(searchInput.toLowerCase());

    const matchStatus = searchSelect === "" || member.status === searchSelect;

    return matchName && matchStatus;
  });

  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Gestão de Membros"
        description="Cadastre, edite e gerencie os membros"
        buttonLabel="Novo Membro"
        onClick={handleNewMember}
      />

      <SearchFilter
        value={searchInput}
        onChange={setSearchInput}
        status={searchSelect}
        onStatusChange={setSearchSelect}
        placeholder="Digite o nome..."
      />

      {filteredMembers.length ? (
        <DataTable columns={columns} data={filteredMembers} />
      ) : (
        <EmptyState
          title="Nenhum membro encontrado"
          description="Cadastre um novo membro"
          action={
            <button
              onClick={handleNewMember}
              className="bg-primary rounded-lg px-4 py-2 text-white"
            >
              Novo Membro
            </button>
          }
        />
      )}

      <MemberModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        member={selectedMember}
        onSave={handleSave}
      />
    </div>
  );
};
