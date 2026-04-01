import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { FiEdit, FiEye } from "react-icons/fi";
import { MinistryModal } from "@/components/modals/MinistryModal";

const initialData = [
  { id: 1, name: "Pastor", leader: "João Silva", status: "ativo" },
  { id: 2, name: "Diácono", leader: "Carlos Pereira", status: "ativo" },
  { id: 3, name: "Louvor", leader: "Maria Souza", status: "ativo" },
  { id: 4, name: "Técnico de Som", leader: "Lucas Santos", status: "inativo" },
  { id: 5, name: "Recepção", leader: "Ana Lima", status: "ativo" },
];

export const Ministries = () => {
  const [ministries, setMinistries] = useState(initialData);
  const [searchInput, setSearchInput] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);

  const handleNew = () => {
    setSelectedMinistry(null);
    setOpenModal(true);
  };

  const handleEdit = (ministry) => {
    setSelectedMinistry(ministry);
    setOpenModal(true);
  };

  const handleSave = (newData) => {
    if (selectedMinistry) {
      // editar
      setMinistries((prev) =>
        prev.map((m) =>
          m.id === selectedMinistry.id ? { ...m, ...newData } : m
        )
      );
    } else {
      // criar
      const newMinistry = {
        id: Date.now(),
        ...newData,
      };
      setMinistries((prev) => [...prev, newMinistry]);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Ministério",
    },
    {
      key: "leader",
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

  const filtered = ministries.filter((m) => {
    const matchName = m.name
      .toLowerCase()
      .includes(searchInput.toLowerCase());

    const matchStatus =
      searchSelect === "" || m.status === searchSelect;

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
      />

      <DataTable columns={columns} data={filtered} />

      <MinistryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        ministry={selectedMinistry}
        onSave={handleSave}
      />
    </div>
  );
};