import { api } from "./api";

export const contributionService = {
  getContributions: async () => {
    const response = await api.get("/contribution");
    return response.data;
  },

  getContributionById: async (id) => {
    const response = await api.get(`/contribution/${id}`);
    return response.data;
  },

  createContribution: async (data) => {
    const response = await api.post("/contribution", data);
    return response.data;
  },

  updateContribution: async (id, data) => {
    const response = await api.put(`/contribution/${id}`, data);
    return response.data;
  },

  deleteContribution: async (id) => {
    const response = await api.delete(`/contribution/${id}`);
    return response.data;
  },
};
