import React from 'react';
import { motion } from 'framer-motion';
import { SOSButton } from '../components/SOSButton';
import { QuickActions } from '../components/QuickActions';
import { NetworkStatus } from '../components/NetworkStatus';
import { useAppStore } from '../stores/useAppStore';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { user, emergencyMode, toggleEmergencyMode, contacts } = useAppStore();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'message':
        onNavigate('messages');
        break;
      case 'contacts':
        onNavigate('contacts');
        break;
      case 'offline':
        onNavigate('offline');
        break;
      case 'settings':
        onNavigate('settings');
        break;
      case 'voice':
        // Implement voice command
        break;
      case 'location':
        // Implement location sharing
        break;
      case 'tracking':
        // Implement live tracking
        break;
      case 'camera':
        // Implement camera
        break;
      case 'medical':
        // Send medical SOS
        break;
      case 'fire':
        // Send fire SOS
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  return (
    <motion.div 
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-5 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🚨 DisasterLink Pro</h1>
          <button
            onClick={toggleEmergencyMode}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              emergencyMode 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            EMERGENCY MODE
          </button>
        </div>

        {/* Status Cards */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-white/15 p-3 rounded-xl text-center backdrop-blur-sm">
            <div className="text-sm opacity-90">Active Nodes</div>
            <div className="text-lg font-bold">{contacts.length || 3}</div>
          </div>
          <div className="flex-1 bg-white/15 p-3 rounded-xl text-center backdrop-blur-sm">
            <div className="text-sm opacity-90">Network Health</div>
            <div className="text-lg font-bold">98%</div>
          </div>
          <div className="flex-1 bg-white/15 p-3 rounded-xl text-center backdrop-blur-sm">
            <div className="text-sm opacity-90">Avg Resp</div>
            <div className="text-lg font-bold">2.1s</div>
          </div>
        </div>

        <NetworkStatus />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 pb-20">
        {/* Emergency Section */}
        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 mb-6 border border-white/20 text-center">
          <SOSButton />
          <p className="text-white text-sm opacity-90">
            Triple tap for instant SOS • Voice: "Emergency Help" • Shake phone 3 times
          </p>
        </div>

        {/* Quick Actions */}
        <QuickActions onAction={handleQuickAction} />

        {/* Smart Suggestions */}
        <div className="mt-6">
          <h4 className="text-white font-semibold mb-3">Smart Suggestions</h4>
          <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="space-y-3 text-white text-sm">
              <div className="py-2 border-b border-white/5">
                📍 Nearby: Evac point - 350m
              </div>
              <div className="py-2 border-b border-white/5">
                💡 Tip: Keep phone accessible
              </div>
              <div className="py-2">
                🌧️ Weather: Heavy rain expected
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
