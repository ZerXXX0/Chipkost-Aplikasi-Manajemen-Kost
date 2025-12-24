import { useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import NotificationCard from '../../components/NotificationCard';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadNotifications = notifications.filter(n => n.status === 'unread');
  const readNotifications = notifications.filter(n => n.status === 'read');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} notifikasi belum dibaca
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              Tandai semua sudah dibaca
            </button>
          )}
        </div>

        {/* Loading state */}
        {isLoading && notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Memuat notifikasi...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">i</span>
            </div>
            <p className="text-gray-600 font-medium">Belum ada notifikasi</p>
            <p className="text-sm text-gray-500 mt-1">
              Notifikasi Anda akan muncul di sini
            </p>
          </div>
        )}

        {/* Notifications list */}
        {!isLoading && notifications.length > 0 && (
          <div className="space-y-6">
            {/* Unread notifications */}
            {unreadNotifications.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Belum Dibaca
                </h2>
                {unreadNotifications.map(notification => (
                  <NotificationCard
                    key={notification.notif_id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            )}

            {/* Read notifications */}
            {readNotifications.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Sudah Dibaca
                </h2>
                {readNotifications.map(notification => (
                  <NotificationCard
                    key={notification.notif_id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
