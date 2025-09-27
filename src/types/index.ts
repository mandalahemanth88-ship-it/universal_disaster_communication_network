export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  ownerId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toContactId: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  timestamp: string;
  location?: Location;
  attachments?: string[];
}

export interface SOSAlert {
  id: string;
  userId: string;
  type: 'medical' | 'fire' | 'police' | 'general';
  description: string;
  location?: Location | null;
  status: 'active' | 'resolved' | 'cancelled';
  timestamp: string;
  evidence?: Evidence[];
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  address?: string;
}

export interface Evidence {
  id: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  timestamp: string;
  location?: Location;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  emergencyMode: boolean;
  offlineMode: boolean;
  networkStatus: 'online' | 'offline' | 'poor';
}

export interface NotificationConfig {
  sound: boolean;
  vibration: boolean;
  push: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
