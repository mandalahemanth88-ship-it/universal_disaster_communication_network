import React from 'react';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Users, Wifi } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'messages', icon: MessageCircle, label: 'Msg' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'offline', icon: Wifi, label: 'Offline' },
  ];

  return (
    <div className="absolute bottom-5 left-5 right-5 bg-white/15 backdrop-blur-md rounded-3xl p-2 border border-white/20">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl min-w-[50px] ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'text-white/70'
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <tab.icon size={20} />
            <span className="text-xs font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
