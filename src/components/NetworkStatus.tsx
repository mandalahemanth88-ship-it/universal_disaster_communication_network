import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

export const NetworkStatus: React.FC = () => {
  const { networkStatus, offlineMode } = useAppStore();

  const getStatusColor = () => {
    switch (networkStatus) {
      case 'online': return 'text-green-400';
      case 'poor': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'online': return Wifi;
      case 'poor': return Signal;
      case 'offline': return WifiOff;
      default: return Wifi;
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <motion.div 
      className={`flex items-center gap-2 ${getStatusColor()}`}
      animate={{ opacity: offlineMode ? [1, 0.5, 1] : 1 }}
      transition={{ duration: 2, repeat: offlineMode ? Infinity : 0 }}
    >
      <StatusIcon size={16} />
      <span className="text-sm font-medium capitalize">{networkStatus}</span>
      {offlineMode && (
        <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
          Offline Mode
        </span>
      )}
    </motion.div>
  );
};
