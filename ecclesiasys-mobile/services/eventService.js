import { api } from "./api";

export const eventService = {
  getEvents: async () => {
    const response = await api.get("/event");
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/event/${id}`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await api.post("/event", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await api.put(`/event/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/event/${id}`);
    return response.data;
  },
};
