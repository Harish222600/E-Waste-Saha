import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - change this to your computer's IP address when testing on physical device
const API_URL = 'http://192.168.29.146:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Signup
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    // Get current user
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// E-Waste API calls (for users)
export const eWasteAPI = {
    // Create e-waste post
    create: async (formData) => {
        const response = await axios.post(`${API_URL}/ewaste`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
        });
        return response.data;
    },

    // Get my e-waste posts
    getMyPosts: async () => {
        const response = await api.get('/ewaste/my-posts');
        return response.data;
    },

    // Get all e-waste posts
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/ewaste?${params}`);
        return response.data;
    },

    // Get single e-waste post
    getById: async (id) => {
        const response = await api.get(`/ewaste/${id}`);
        return response.data;
    },

    // Update e-waste post
    update: async (id, formData) => {
        const response = await axios.put(`${API_URL}/ewaste/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
        });
        return response.data;
    },

    // Delete e-waste post
    delete: async (id) => {
        const response = await api.delete(`/ewaste/${id}`);
        return response.data;
    },

    // Mark as collected
    markCollected: async (id) => {
        const response = await api.put(`/ewaste/${id}/collect`);
        return response.data;
    },
};

// Bulk E-Waste API calls (for collectors)
export const bulkEWasteAPI = {
    // Create bulk e-waste post
    create: async (formData) => {
        const response = await axios.post(`${API_URL}/bulk-ewaste`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
        });
        return response.data;
    },

    // Get my bulk e-waste posts
    getMyPosts: async () => {
        const response = await api.get('/bulk-ewaste/my-posts');
        return response.data;
    },

    // Get all bulk e-waste posts
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/bulk-ewaste?${params}`);
        return response.data;
    },

    // Get single bulk e-waste post
    getById: async (id) => {
        const response = await api.get(`/bulk-ewaste/${id}`);
        return response.data;
    },

    // Update bulk e-waste post
    update: async (id, formData) => {
        const response = await axios.put(`${API_URL}/bulk-ewaste/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
        });
        return response.data;
    },

    // Delete bulk e-waste post
    delete: async (id) => {
        const response = await api.delete(`/bulk-ewaste/${id}`);
        return response.data;
    },

    // Mark as sold
    markSold: async (id) => {
        const response = await api.put(`/bulk-ewaste/${id}/sold`);
        return response.data;
    },
};

export default api;
