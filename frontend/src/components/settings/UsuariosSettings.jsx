import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { SearchFilter } from "@/components/SearchFilter";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import { FiEdit, FiTrash } from "react-icons/fi";
import { MemberModal } from "../modals/MemberModal";


export const UsuariosSettings = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [data, setData] = useState([
    {
      _id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      nivel: "Admin",
      status: "ativo",
    },
    {
      _id: 2,
      nome: "Maria Souza",
      email: "maria@email.com",
      nivel: "Usuário",
      status: "ativo",
    },
    {
      _id: 3,
      nome: "Carlos Lima",
      email: "carlos@email.com",
      nivel: "Usuário",
      status: "inativo",
    },
  ]);

  // 🔍 filtro
  const filteredData = data.filter((user) => {
    return (
      user.nome.toLowerCase().includes(search.toLowerCase()) &&
      (status ? user.status === status : true)
    );
  });

  // ➕ novo membro
  const handleAdd = () => {
    setSelectedMember(null);
    setOpenModal(true);
  };

  // ✏️ editar membro
  const handleEdit = (row) => {
    setSelectedMember({
      ...row,
      name: row.nome, // compatível com modal
    });
    setOpenModal(true);
  };

  // 💾 salvar (criar ou editar)
  const handleSave = (member) => {
    if (member._id) {
      // editar
      setData((prev) =>
        prev.map((item) =>
          item._id === member._id
            ? {
                ...item,
                nome: member.name,
                email: member.email,
                status: member.status === "active" ? "ativo" : "inativo",
              }
            : item
        )
      );
    } else {
      // criar
      const newMember = {
        _id: Date.now(),
        nome: member.name,
        email: member.email,
        nivel: "Usuário",
        status: member.status === "active" ? "ativo" : "inativo",
      };

      setData((prev) => [newMember, ...prev]);
    }
  };

  // 🗑️ excluir
  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item._id !== id));
  };

  const columns = [
    {
      key: "nome",
      label: "Nome",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "nivel",
      label: "Nível de Acesso",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold
            ${
              row.nivel === "Admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >
          {row.nivel}
        </span>
      ),
    },
    {
      key: "acoes",
      label: "Ações",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-gray-600 hover:scale-110 transition"
          >
            <FiEdit size={18} />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="text-gray-600 hover:scale-110 transition"
          >
            <FiTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Usuários do Sistema
        </h2>

        <Button
          onClick={handleAdd}
          className="bg-slate-800 p-5 hover:bg-slate-700 flex items-center gap-2"
        >
          <GoPlus />
          Adicionar Membro
        </Button>
      </div>

      {/* Filtro */}
      <SearchFilter
        value={search}
        onChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        placeholder="Buscar usuário..."
      />

      {/* Tabela */}
      <DataTable columns={columns} data={filteredData} />

      {/* Modal */}
      <MemberModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        member={selectedMember}
      />
    </div>
  );
};