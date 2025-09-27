import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { AppState, EmergencyContact, Message, User } from '../types';

interface AppStore extends AppState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  toggleEmergencyMode: () => void;
  setNetworkStatus: (status: 'online' | 'offline' | 'poor') => void;
  
  contacts: EmergencyContact[];
  setContacts: (contacts: EmergencyContact[]) => void;
  addContact: (contact: EmergencyContact) => void;
  updateContact: (id: string, updates: Partial<EmergencyContact>) => void;
  removeContact: (id: string) => void;
  
  messages: Message[];
  pendingMessages: Message[];
  addMessage: (message: Message) => void;
  addPendingMessage: (message: Message) => void;
  markMessageSent: (id: string) => void;
  clearPendingMessages: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  emergencyMode: false,
  offlineMode: false,
  networkStatus: 'online',
  contacts: [],
  messages: [],
  pendingMessages: [],

  setSession: (session) => set({ session, isAuthenticated: !!session, user: session?.user ? { id: session.user.id, email: session.user.email!, username: session.user.user_metadata?.username || session.user.email!, createdAt: session.user.created_at, isActive: true } : null }),
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  toggleEmergencyMode: () => set((state) => ({ emergencyMode: !state.emergencyMode })),
  setNetworkStatus: (networkStatus) => set({ networkStatus, offlineMode: networkStatus === 'offline' }),

  setContacts: (contacts) => set({ contacts }),
  addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
  updateContact: (id, updates) => set((state) => ({
    contacts: state.contacts.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    )
  })),
  removeContact: (id) => set((state) => ({
    contacts: state.contacts.filter(contact => contact.id !== id)
  })),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addPendingMessage: (message) => set((state) => ({ 
    pendingMessages: [...state.pendingMessages, message] 
  })),
  markMessageSent: (id) => set((state) => ({
    pendingMessages: state.pendingMessages.filter(msg => msg.id !== id),
    messages: [...state.messages, ...state.pendingMessages.filter(msg => msg.id === id)]
  })),
  clearPendingMessages: () => set({ pendingMessages: [] }),
}));
