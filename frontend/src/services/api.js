import axios from 'axios';

// Use direct backend URL for testing
const API_BASE_URL = 'http://localhost:8001/api/v1';

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
    try {
      const response = await fetch(`${API_BASE_URL}/generate-routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Route generation error:', error);
      return { success: false, error: error.message };
    }
  },

  // Procurement & Inventory - Ollama + Gemini Pipeline
  generateProcurement: async (data) => {
    try {
      // Prepare procurement request for Ollama processing agent
      const procurementRequest = {
        materials_list: data.materials_list,
        quantities: data.quantities,
        preferred_brands: data.preferred_brands,
        budget_limit: data.budget_limit,
        urgency: data.urgency,
        supplier_preference: data.supplier_preference,
        processing_pipeline: {
          agent: "ollama",
          llm_backend: "gemini",
          task_type: "procurement_search",
          search_providers: ["sigma-aldrich", "thermo-fisher", "bio-rad", "neb"],
          response_format: "structured_procurement_data"
        }
      };

      console.log('Sending procurement request to Ollama agent:', procurementRequest);

      const response = await fetch(`${API_BASE_URL}/generate-procurement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Processing-Agent': 'ollama',
          'X-LLM-Backend': 'gemini',
          'X-Task-Type': 'procurement-search'
        },
        body: JSON.stringify(procurementRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Validate the response structure from Ollama
      if (!result.success) {
        throw new Error(result.error || 'Procurement processing failed');
      }

      // Log the processed response from Gemini via Ollama
      console.log('Received processed procurement data from Ollama/Gemini:', result);
      
      return result;
    } catch (error) {
      console.error('Procurement generation error:', error);
      
      // Enhanced error handling for different failure points
      if (error.message.includes('HTTP 404')) {
        return { 
          success: false, 
          error: 'Procurement service not available. Please ensure Ollama agent is running and connected to Gemini.' 
        };
      } else if (error.message.includes('HTTP 500')) {
        return { 
          success: false, 
          error: 'Internal processing error in Ollama/Gemini pipeline. Please try again.' 
        };
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to Ollama processing agent. Please check if the service is running.' 
        };
      }
      
      return { success: false, error: error.message };
    }
  },

  // Firebase Inventory Manager (IMS-Gen) - Llama Processing
  uploadInventory: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/upload-inventory`, {
        method: 'POST',
        body: formData, // FormData with file
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Inventory upload error:', error);
      return { success: false, error: error.message };
    }
  },

  getInventory: async () => {
    try {
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get inventory error:', error);
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout - backend not responding' };
      }
      return { success: false, error: error.message };
    }
  },

  searchInventory: async (searchTerm) => {
    try {
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/inventory/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search_term: searchTerm }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Search inventory error:', error);
      if (error.name === 'AbortError') {
        return { success: false, error: 'Search timeout - backend not responding' };
      }
      return { success: false, error: error.message };
    }
  },

  checkInventoryAvailability: async (materialName, requiredQuantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          material_name: materialName,
          required_quantity: requiredQuantity 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Check availability error:', error);
      return { success: false, error: error.message };
    }
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
