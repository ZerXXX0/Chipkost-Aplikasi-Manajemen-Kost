import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    // Only fetch if user is authenticated
    if (!authService.isAuthenticated()) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.get('/notifikasi/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setNotifications(data);
      const unread = data.filter(n => n.status === 'unread').length;
      setUnreadCount(unread);
    } catch (error) {
      // Don't log 401 errors as they're expected when not authenticated
      if (error.response?.status !== 401) {
        console.error('Error fetching notifications:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    if (!authService.isAuthenticated()) return;
    
    try {
      await api.patch(`/notifikasi/${notifId}/`, { status: 'read' });
      setNotifications(prev =>
        prev.map(n => (n.notif_id === notifId ? { ...n, status: 'read' } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!authService.isAuthenticated()) return;
    
    try {
      const unreadNotifications = notifications.filter(n => n.status === 'unread');
      await Promise.all(
        unreadNotifications.map(n => api.patch(`/notifikasi/${n.notif_id}/`, { status: 'read' }))
      );
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notifId) => {
    if (!authService.isAuthenticated()) return;
    
    try {
      await api.delete(`/notifikasi/${notifId}/`);
      setNotifications(prev => prev.filter(n => n.notif_id !== notifId));
      const deleted = notifications.find(n => n.notif_id === notifId);
      if (deleted && deleted.status === 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Clear notifications on logout
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds (only if authenticated)
    const interval = setInterval(() => {
      if (authService.isAuthenticated()) {
        fetchNotifications();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
