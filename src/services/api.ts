import axios from 'axios';
import { User, EmergencyContact, Message, SOSAlert, Location, Evidence } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: { username: string; email: string; password: string; phone?: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export const contactsAPI = {
  getContacts: async (): Promise<EmergencyContact[]> => {
    const response = await api.get('/contacts');
    return response.data.contacts;
  },
  
  createContact: async (contact: Omit<EmergencyContact, 'id' | 'createdAt' | 'ownerId'>) => {
    const response = await api.post('/contacts', contact);
    return response.data;
  },
  
  updateContact: async (id: string, updates: Partial<EmergencyContact>) => {
    const response = await api.put(`/contacts/${id}`, updates);
    return response.data;
  },
  
  deleteContact: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};

export const messageAPI = {
  sendMessage: async (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    const response = await api.post('/messages', message);
    return response.data;
  },
  
  getMessages: async (): Promise<Message[]> => {
    const response = await api.get('/messages');
    return response.data.messages;
  },
  
  markAsDelivered: async (messageId: string) => {
    const response = await api.patch(`/messages/${messageId}/delivered`);
    return response.data;
  },
};

export const sosAPI = {
  sendSOS: async (sosData: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>) => {
    const response = await api.post('/sos', sosData);
    return response.data;
  },
  
  updateSOSStatus: async (id: string, status: SOSAlert['status']) => {
    const response = await api.patch(`/sos/${id}/status`, { status });
    return response.data;
  },
};

export const locationAPI = {
  shareLocation: async (location: Location) => {
    const response = await api.post('/location', location);
    return response.data;
  },
  
  startLiveTracking: async () => {
    const response = await api.post('/location/live');
    return response.data;
  },
  
  stopLiveTracking: async () => {
    const response = await api.delete('/location/live');
    return response.data;
  },
};

export const evidenceAPI = {
  uploadEvidence: async (evidence: FormData) => {
    const response = await api.post('/evidence', evidence, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  getEvidence: async (id: string): Promise<Evidence> => {
    const response = await api.get(`/evidence/${id}`);
    return response.data;
  },
};

export const voiceAPI = {
  processVoiceCommand: async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    const response = await api.post('/voice/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default api;
