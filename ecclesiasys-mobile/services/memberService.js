import { api } from "./api";

export const memberService = {
  getMembers: async () => {
    const response = await api.get("/member");
    return response.data;
  },

  getMemberById: async (id) => {
    const response = await api.get(`/member/${id}`);
    return response.data;
  },

  createMember: async (data) => {
    const response = await api.post("/member", data);
    return response.data;
  },

  updateMember: async (id, data) => {
    const response = await api.put(`/member/${id}`, data);
    return response.data;
  },

  deleteMember: async (id) => {
    const response = await api.delete(`/member/${id}`);
    return response.data;
  },
};
