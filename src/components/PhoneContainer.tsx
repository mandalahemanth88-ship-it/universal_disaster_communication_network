import React from 'react';
import { motion } from 'framer-motion';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div 
        className="relative w-[390px] h-[780px] bg-gray-900 rounded-[35px] p-2 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Phone Screen */}
        <div className="w-full h-full bg-black rounded-[28px] overflow-hidden relative">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[25px] bg-gray-900 rounded-b-2xl z-10" />
          
          {/* Status Bar */}
          <div className="h-11 bg-black/10 flex justify-between items-center px-5 text-white text-sm font-semibold relative z-20">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1">
              <span>🔋 85%</span>
              <span>📶 LoRa</span>
            </div>
          </div>

          {/* App Content */}
          <div className="h-[calc(100%-44px)] bg-gradient-to-br from-primary-500 to-purple-600 relative">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
