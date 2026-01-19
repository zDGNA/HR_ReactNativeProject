import axios from 'axios';

// PENTING: Ganti sesuai kebutuhan
// Emulator Android: http://10.0.2.2:3000/api
// Emulator iOS: http://localhost:3000/api
// Device Fisik: http://[IP_KOMPUTER]:3000/api (cek dengan ipconfig/ifconfig)
const BASE_URL = 'http://192.168.248.3:3000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// AUTH API
export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },
};

// DIVISION API
export const divisionAPI = {
    getAll: async () => {
        const response = await api.get('/divisions');
        return response.data;
    },
};

// EMPLOYEE API
export const employeeAPI = {
    getAll: async () => {
        const response = await api.get('/employees');
        return response.data;
    },

    getByDivision: async (divisionId: string) => {
        const response = await api.get(`/employees/division/${divisionId}`);
        return response.data;
    },
};


// ANNOUNCEMENT API
export const announcementAPI = {
    getContracts: async () => {
        const response = await api.get('/announcements/contracts');
        return response.data;
    },
};

// USER API (TAMBAHKAN INI)
export const userAPI = {
    updateUsername: async (userId: number, newUsername: string) => {
        const response = await api.put('/users/update-username', { userId, newUsername });
        return response.data;
    },
    updatePassword: async (userId: number, oldPassword: string, newPassword: string) => {
        const response = await api.put('/users/update-password', { userId, oldPassword, newPassword });
        return response.data;
    },
};

export default api;