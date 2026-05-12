import axios from "axios";

const API_URL = 'https://blaz-crm-server.cyclic.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Contacts
export const getContacts = () => api.get("/contacts");
export const getContact = (id) => api.get(`/contacts/${id}`);
export const createContact = (data) => api.post("/contacts", data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// Deals
export const getDeals = () => api.get("/deals");
export const createDeal = (data) => api.post("/deals", data);
export const updateDeal = (id, data) => api.put(`/deals/${id}`, data);
export const deleteDeal = (id) => api.delete(`/deals/${id}`);

// Blasts
export const getBlasts = () => api.get("/blasts");
export const createBlast = (data) => api.post("/blasts", data);

// Dashboard
export const getDashboardStats = () => api.get("/dashboard/stats");
export const getRecentDeals = () => api.get("/recent-deals");

// Test connection
export const testConnection = () => api.get("/test");

export default api;
