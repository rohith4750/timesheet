import React, { createContext, useContext, useState } from 'react';
import Alerts, { Alert } from './toast';

interface ToastContextType {
  showToast: (alert: Alert) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showToast = (alert: Alert) => {
    setAlerts((currentAlerts) => [...currentAlerts, alert]);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Alerts alerts={alerts} setAlerts={setAlerts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};