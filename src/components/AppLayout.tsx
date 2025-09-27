import React, { useState, useEffect } from 'react';
import { PhoneContainer } from './PhoneContainer';
import { NavigationTabs } from './NavigationTabs';
import { HomeScreen } from '../screens/HomeScreen';
import { useAppStore } from '../stores/useAppStore';
import { offlineManager } from '../services/offline';

export const AppLayout: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const { setNetworkStatus } = useAppStore();

  useEffect(() => {
    offlineManager.initialize();

    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [setNetworkStatus]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'messages':
        return (
          <div className="h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Messages</h2>
              <p className="text-sm opacity-75">Coming soon...</p>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Emergency Contacts</h2>
              <p className="text-sm opacity-75">Coming soon...</p>
            </div>
          </div>
        );
      case 'offline':
        return (
          <div className="h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Offline Messages</h2>
              <p className="text-sm opacity-75">Coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Settings</h2>
              <p className="text-sm opacity-75">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <PhoneContainer>
      {renderScreen()}
      <NavigationTabs 
        activeTab={currentScreen} 
        onTabChange={setCurrentScreen} 
      />
    </PhoneContainer>
  );
}
