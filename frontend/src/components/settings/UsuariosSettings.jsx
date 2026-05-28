import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { SearchFilter } from "@/components/SearchFilter";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import { FiEdit, FiTrash } from "react-icons/fi";
import { api } from "@/services/api";
import { toast } from "sonner";
import { UserModal } from "../modals/UserModal";

export const UsuariosSettings = () => {

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ buscar usuários
  const fetchUsers = async () => {

    try {

      setLoading(true);

      const res = await api.get("/user");

      const formatted = res.data.users.map((user) => ({

        _id: user._id,

        nome: user.name,

        email: user.email,

        role: user.role,

      }));

      setData(formatted);

    } catch (err) {

      console.error(err);

      toast.error("Erro ao carregar usuários");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 filtro
  const filteredData = useMemo(() => {

    return data.filter((user) =>
      user.nome
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [data, search]);

  // ➕ novo
  const handleAdd = () => {

    setSelectedUser(null);

    setOpenModal(true);
  };

  // ✏️ editar
  const handleEdit = (row) => {

    setSelectedUser({

      _id: row._id,

      name: row.nome,

      email: row.email,

      role: row.role,

    });

    setOpenModal(true);
  };

  // 💾 salvar
  const handleSave = async (userData) => {

    try {

      // ✅ editar
      if (userData._id) {

        await api.put(`/user/${userData._id}`, {

          name: userData.name,

          email: userData.email,

          password: userData.password,

          role: userData.role,
        });

        toast.success("Usuário atualizado");

      } else {

        // ✅ criar
        await api.post("/user", {

          name: userData.name,

          email: userData.email,

          password: userData.password,

          role: userData.role,
        });

        toast.success("Usuário criado");
      }

      await fetchUsers();

      setOpenModal(false);

      setSelectedUser(null);

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Erro ao salvar usuário"
      );
    }
  };

  // 🗑️ excluir
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Deseja excluir este usuário?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/user/${id}`);

      toast.success("Usuário excluído");

      setData((prev) =>
        prev.filter((item) => item._id !== id)
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Erro ao excluir usuário"
      );
    }
  };

  // 📊 colunas
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
      key: "role",
      label: "Nível de acesso",

      render: (row) => (

        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold
          
            ${
              row.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >

          {row.role === "admin"
            ? "Administrador"
            : "Usuário"}

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

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold">
          Usuários do Sistema
        </h2>

        <Button
          onClick={handleAdd}
          className="bg-slate-800 p-5 hover:bg-slate-700 flex items-center gap-2"
        >

          <GoPlus />

          Adicionar Usuário

        </Button>
      </div>

      {/* FILTRO */}
      <SearchFilter
        value={search}
        onChange={setSearch}
        placeholder="Buscar usuário..."
      />

      {/* TABELA */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
      />

      {/* MODAL */}
      <UserModal
        open={openModal}

        onClose={() => {

          setOpenModal(false);

          setSelectedUser(null);
        }}

        onSave={handleSave}

        user={selectedUser}
      />
    </div>
  );
};