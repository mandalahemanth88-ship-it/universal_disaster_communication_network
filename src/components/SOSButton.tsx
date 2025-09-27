import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useLocation } from '../hooks/useLocation';
import { sosAPI } from '../services/api';
import { useNotificationStore } from '../stores/useNotificationStore';
import { Location } from '../types';

export const SOSButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, emergencyMode } = useAppStore();
  const { getCurrentLocation } = useLocation();
  const { addNotification } = useNotificationStore();

  const handleSOSPress = async () => {
    if (isLoading) return;

    setIsPressed(true);
    setIsLoading(true);

    let locationData: Location | null = null;
    try {
      locationData = await getCurrentLocation();
    } catch (locationError) {
      console.warn('Could not retrieve location:', locationError);
      addNotification({
        message: 'Location disabled. SOS sent without it.',
        type: 'warning',
      });
    }

    try {
      await sosAPI.sendSOS({
        userId: user?.id || 'demo-user',
        type: 'general',
        description: 'Emergency SOS triggered by user',
        location: locationData,
      });

      addNotification({ message: 'SOS Alert Sent!', type: 'success' });

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (sosError) {
      console.error('Failed to send SOS:', sosError);
      addNotification({ message: 'Failed to send SOS. Check connection.', type: 'error' });
      // The offline manager should handle queuing if it's a network error
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsPressed(false), 1000);
    }
  };

  return (
    <div className="flex justify-center mb-4">
      <motion.button
        onClick={handleSOSPress}
        onTapStart={() => setIsPressed(true)}
        onTapCancel={() => setIsPressed(false)}
        className={`w-32 h-32 rounded-full bg-gradient-to-br from-emergency-500 to-emergency-600 
          border-4 border-white/30 flex flex-col items-center justify-center text-white font-bold
          shadow-lg transition-all duration-200 ${
            emergencyMode ? 'animate-emergency-pulse' : ''
          }`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
        disabled={isLoading}
      >
        {isLoading ? (
          <motion.div
            className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            <AlertTriangle size={32} />
            <span className="text-lg mt-2">SOS</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
