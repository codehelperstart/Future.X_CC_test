import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useUIStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          icon: 'text-success-500',
          title: 'text-success-800',
          message: 'text-success-700',
        };
      case 'error':
        return {
          bg: 'bg-danger-50',
          border: 'border-danger-200',
          icon: 'text-danger-500',
          title: 'text-danger-800',
          message: 'text-danger-700',
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          border: 'border-warning-200',
          icon: 'text-warning-500',
          title: 'text-warning-800',
          message: 'text-warning-700',
        };
      default:
        return {
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          icon: 'text-primary-500',
          title: 'text-primary-800',
          message: 'text-primary-700',
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          const colors = getColors(notification.type);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
              className={`
                ${colors.bg} ${colors.border} border rounded-lg shadow-lg p-4
                relative overflow-hidden backdrop-blur-sm
              `}
            >
              {/* Progress bar for auto-close */}
              {notification.autoClose && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: 0 }}
                  transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-1 ${
                    notification.type === 'success' ? 'bg-success-400' :
                    notification.type === 'error' ? 'bg-danger-400' :
                    notification.type === 'warning' ? 'bg-warning-400' :
                    'bg-primary-400'
                  }`}
                />
              )}

              <div className="flex items-start space-x-3">
                <Icon className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                
                <div className="flex-1 min-w-0">
                  {notification.title && (
                    <p className={`text-sm font-medium ${colors.title} mb-1`}>
                      {notification.title}
                    </p>
                  )}
                  <p className={`text-sm ${colors.message}`}>
                    {notification.message}
                  </p>
                </div>

                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Action buttons */}
              {notification.actions && (
                <div className="mt-3 flex space-x-2">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.handler();
                        if (action.closeOnClick !== false) {
                          removeNotification(notification.id);
                        }
                      }}
                      className={`
                        text-xs font-medium px-3 py-1 rounded-md transition-colors
                        ${action.primary
                          ? `${
                              notification.type === 'success' ? 'bg-success-600 hover:bg-success-700' :
                              notification.type === 'error' ? 'bg-danger-600 hover:bg-danger-700' :
                              notification.type === 'warning' ? 'bg-warning-600 hover:bg-warning-700' :
                              'bg-primary-600 hover:bg-primary-700'
                            } text-white`
                          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                        }
                      `}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;