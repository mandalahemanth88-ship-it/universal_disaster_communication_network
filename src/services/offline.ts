import Dexie, { Table } from 'dexie';
import { Message, SOSAlert, Location } from '../types';

// IndexedDB for offline storage
export class OfflineDB extends Dexie {
  pendingMessages!: Table<Message>;
  pendingSOS!: Table<SOSAlert>;
  pendingLocations!: Table<Location>;
  cachedData!: Table<{ key: string; data: any; timestamp: number }>;

  constructor() {
    super('DisasterLinkOfflineDB');
    
    this.version(1).stores({
      pendingMessages: '++id, timestamp, status, priority',
      pendingSOS: '++id, timestamp, status',
      pendingLocations: '++timestamp',
      cachedData: 'key, timestamp'
    });
  }
}

export const offlineDB = new OfflineDB();

export class OfflineManager {
  private syncInterval: NodeJS.Timeout | null = null;

  async initialize() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Start periodic sync if online
    if (navigator.onLine) {
      this.startPeriodicSync();
    }
  }

  private handleOnline() {
    console.log('Device back online - syncing pending data...');
    this.syncPendingData();
    this.startPeriodicSync();
  }

  private handleOffline() {
    console.log('Device offline - data will be queued');
    this.stopPeriodicSync();
  }

  private startPeriodicSync() {
    this.syncInterval = setInterval(() => {
      this.syncPendingData();
    }, 30000); // Sync every 30 seconds
  }

  private stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async queueMessage(message: Message) {
    await offlineDB.pendingMessages.add({
      ...message,
      status: 'pending'
    });
  }

  async queueSOS(sos: SOSAlert) {
    await offlineDB.pendingSOS.add(sos);
  }

  async queueLocation(location: Location) {
    await offlineDB.pendingLocations.add(location);
  }

  async syncPendingData() {
    if (!navigator.onLine) return;

    try {
      // Sync pending messages
      const pendingMessages = await offlineDB.pendingMessages.toArray();
      for (const message of pendingMessages) {
        try {
          const { messageAPI } = await import('./api');
          await messageAPI.sendMessage(message);
          await offlineDB.pendingMessages.delete(message.id);
        } catch (error) {
          console.error('Failed to sync message:', error);
        }
      }

      // Sync pending SOS alerts
      const pendingSOS = await offlineDB.pendingSOS.toArray();
      for (const sos of pendingSOS) {
        try {
          const { sosAPI } = await import('./api');
          await sosAPI.sendSOS(sos);
          await offlineDB.pendingSOS.delete(sos.id);
        } catch (error) {
          console.error('Failed to sync SOS:', error);
        }
      }

      // Sync pending locations
      const pendingLocations = await offlineDB.pendingLocations.toArray();
      for (const location of pendingLocations) {
        try {
          const { locationAPI } = await import('./api');
          await locationAPI.shareLocation(location);
          await offlineDB.pendingLocations.delete(location.timestamp);
        } catch (error) {
          console.error('Failed to sync location:', error);
        }
      }

    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  async getCachedData(key: string) {
    const cached = await offlineDB.cachedData.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.data;
    }
    return null;
  }

  async setCachedData(key: string, data: any) {
    await offlineDB.cachedData.put({
      key,
      data,
      timestamp: Date.now()
    });
  }
}

export const offlineManager = new OfflineManager();
