import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Satellite,
  Camera,
  Users,
  Wifi,
  Settings,
  Mic,
  Heart,
  Flame
} from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const emergencyActions = [
    { id: 'medical', icon: Heart, label: 'Medical', color: 'bg-red-500' },
    { id: 'fire', icon: Flame, label: 'Fire', color: 'bg-orange-500' },
  ];

  const mainActions = [
    { id: 'voice', icon: Mic, label: 'Voice' },
    { id: 'message', icon: MessageSquare, label: 'Smart Message' },
    { id: 'location', icon: MapPin, label: 'Share Loc' },
    { id: 'tracking', icon: Satellite, label: 'Live Track' },
    { id: 'camera', icon: Camera, label: 'Photo' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'offline', icon: Wifi, label: 'Offline Msg' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="space-y-4">
      {/* Emergency Actions */}
      <div className="flex justify-center gap-5">
        {emergencyActions.map((action) => (
          <motion.button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 text-white min-w-[70px]`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <action.icon size={24} />
            <span className="text-xs font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-4 gap-3">
        {mainActions.map((action) => (
          <motion.button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center gap-2 text-white border border-white/20"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <action.icon size={20} />
            <span className="text-xs font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
