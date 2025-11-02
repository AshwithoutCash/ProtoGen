import axios from 'axios';

// Use relative URL to leverage Vite proxy
const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const protocolAPI = {
  // Generate a new protocol
  generateProtocol: async (data) => {
    const response = await api.post('/generate', data);
    return response.data;
  },

  // Troubleshoot a protocol
  troubleshootProtocol: async (data) => {
    const response = await api.post('/troubleshoot', data);
    return response.data;
  },

  // Get available techniques
  getTechniques: async () => {
    const response = await api.get('/techniques');
    return response.data;
  },

  // Get available LLM providers
  getProviders: async () => {
    const response = await api.get('/providers');
    return response.data;
  },

  // Generate experimental routes
  generateRoutes: async (data) => {
    const response = await api.post('/routes', data);
    return response.data;
  },

  // Generate tool recommendations
  generateTools: async (data) => {
    const response = await api.post('/tools', data);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
