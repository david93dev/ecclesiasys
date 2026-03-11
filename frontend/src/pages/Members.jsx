import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { FiEdit, FiEye } from "react-icons/fi";
import { MemberModal } from "@/components/modals/MemberModal";

const data = [
  { id: 1, name: "João Silva", status: "ativo" },
  { id: 2, name: "Maria Souza", status: "inativo" },
  { id: 3, name: "Carlos Pereira", status: "ativo" },
];

export const Members = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleNewMember = () => {
    setSelectedMember(null);
    setOpenModal(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setOpenModal(true);
  };

  const columns = [
    {
      key: "name",
      label: "Nome",
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
          <button className="hover:text-blue-600">
            <FiEye size={18} />
          </button>

          <button
            onClick={() => handleEdit(row)}
            className="hover:text-amber-600"
          >
            <FiEdit size={18} />
          </button>
        </div>
      ),
    },
  ];

  const filteredMembers = data.filter((member) => {
    const matchName = member.name
      .toLowerCase()
      .includes(searchInput.toLowerCase());

    const matchStatus =
      searchSelect === "" || member.status === searchSelect;

    return matchName && matchStatus;
  });

  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Gestão de Membros"
        description="Cadastre, edite e gerencie todos os membros da igreja"
        buttonLabel="Novo Membro"
        onClick={handleNewMember}
      />

      <SearchFilter
        value={searchInput}
        onChange={setSearchInput}
        status={searchSelect}
        onStatusChange={setSearchSelect}
        placeholder="Digite o nome do membro..."
      />

      <DataTable columns={columns} data={filteredMembers} />

      <MemberModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        member={selectedMember}
        onSave={(data) => console.log(data)}
      />
    </div>
  );
};