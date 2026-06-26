import { api } from "./api";

export const ministryService = {
  getMinistries: async () => {
    const response = await api.get("/ministry");
    return response.data;
  },

  getMinistryById: async (id) => {
    const response = await api.get(`/ministry/${id}`);
    return response.data;
  },

  createMinistry: async (data) => {
    const response = await api.post("/ministry", data);
    return response.data;
  },

  updateMinistry: async (id, data) => {
    const response = await api.put(`/ministry/${id}`, data);
    return response.data;
  },

  deleteMinistry: async (id) => {
    const response = await api.delete(`/ministry/${id}`);
    return response.data;
  },
};
