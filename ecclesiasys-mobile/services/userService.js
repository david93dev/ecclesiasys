import { api } from "./api";

export const userService = {
  getUsers: async () => {
    const response = await api.get("/user");
    return response.data.users;
  },

  createUser: async (data) => {
    const response = await api.post("/user", data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },
};
