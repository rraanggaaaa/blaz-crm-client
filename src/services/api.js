import axios from 'axios';

// Gunakan environment variable untuk URL API
const API_URL = process.env.REACT_APP_API_URL || 'https://blaz-crm-server.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor untuk debugging
api.interceptors.request.use((config) => {
  console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ Error from ${error.config?.url}:`, error.message);
    return Promise.reject(error);
  }
);

// Dashboard endpoints
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRecentDeals = () => api.get('/recent-deals');
export const getActiveBlasts = () => api.get('/blasts');
export const getDealsByStage = () => api.get('/deals/by-stage');

// Contacts endpoints
export const getContacts = () => api.get('/contacts');
export const getContact = (id) => api.get(`/contacts/${id}`);
export const createContact = (data) => api.post('/contacts', data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// Deals endpoints
export const getDeals = () => api.get('/deals');
export const createDeal = (data) => api.post('/deals', data);
export const updateDeal = (id, data) => api.put(`/deals/${id}`, data);
export const deleteDeal = (id) => api.delete(`/deals/${id}`);

// Blasts endpoints
export const getBlasts = () => api.get('/blasts');
export const createBlast = (data) => api.post('/blasts', data);

// Test connection
export const testConnection = () => api.get('/test');

export default api;