import axios from 'axios';

// PENTING: Ganti sesuai kebutuhan
// Emulator Android: http://10.0.2.2:3000/api
// Emulator iOS: http://localhost:3000/api
// Device Fisik: http://[IP_KOMPUTER]:3000/api (cek dengan ipconfig/ifconfig)
const BASE_URL = 'http://192.168.1.66:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor untuk logging (opsional, untuk debugging)
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.config?.url}`, error.message);
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// ==================== DIVISION API ====================
export const divisionAPI = {

  getAll: async () => {
    const response = await api.get('/divisions');
    return response.data;
  },

  getById: async (divisionId: string) => {
    const response = await api.get(`/divisions/${divisionId}`);
    return response.data;
  },
};

// ==================== EMPLOYEE API ====================
export const employeeAPI = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getByDivision: async (divisionId: string) => {
    const response = await api.get(`/employees/division/${divisionId}`);
    return response.data;
  },

  // Create new employee
  create: async (employeeData: any) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // Update employee
  update: async (employeeId: number, employeeData: any) => {
    const response = await api.put(`/employees/${employeeId}`, employeeData);
    return response.data;
  },

  // Delete employee
  delete: async (employeeId: number) => {
    const response = await api.delete(`/employees/${employeeId}`);
    return response.data;
  },

  // Update employee status
  updateStatus: async (employeeId: number, status: string) => {
    const response = await api.put(`/employees/${employeeId}/status`, { status });
    return response.data;
  },
};

// ==================== ANNOUNCEMENT API ====================
export const announcementAPI = {
  // Get contract expiry announcements
  getContracts: async () => {
    const response = await api.get('/announcements/contracts');
    return response.data;
  },
};

// ==================== USER API ====================
export const userAPI = {
  // Update username
  updateUsername: async (userId: number, newUsername: string) => {
    const response = await api.put('/users/update-username', { userId, newUsername });
    return response.data;
  },

  // Update password
  updatePassword: async (userId: number, oldPassword: string, newPassword: string) => {
    const response = await api.put('/users/update-password', { userId, oldPassword, newPassword });
    return response.data;
  },
};

export default api;