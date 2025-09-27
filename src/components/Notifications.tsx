import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotificationStore } from '../stores/useNotificationStore';

const notificationIcons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  info: <Info className="text-blue-500" />,
};

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[5000] w-full max-w-sm px-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface NotificationItemProps {
  notification: ReturnType<typeof useNotificationStore.getState>['notifications'][0];
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, notification.duration || 3000);

    return () => clearTimeout(timer);
  }, [notification, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="mb-4 flex items-center p-3 bg-gray-800/80 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/20"
    >
      <div className="mr-3">{notificationIcons[notification.type]}</div>
      <p className="text-sm font-medium">{notification.message}</p>
    </motion.div>
  );
};
