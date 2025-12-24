import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationIcon = (message) => {
    if (message.includes('Berhasil')) return '✓';
    if (message.includes('Dibatalkan')) return '✕';
    if (message.includes('Diverifikasi')) return '✓';
    if (message.includes('Selamat datang')) return '→';
    return 'i';
  };

  const getNotificationColor = (message) => {
    if (message.includes('Berhasil') || message.includes('Diverifikasi')) return 'bg-green-50 border-green-200';
    if (message.includes('Dibatalkan')) return 'bg-red-50 border-red-200';
    if (message.includes('Selamat datang')) return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getIconColor = (message) => {
    if (message.includes('Berhasil') || message.includes('Diverifikasi')) return 'bg-green-500 text-white';
    if (message.includes('Dibatalkan')) return 'bg-red-500 text-white';
    if (message.includes('Selamat datang')) return 'bg-blue-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const handleMarkAsRead = () => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification.notif_id);
    }
  };

  return (
    <div
      className={`p-4 mb-3 rounded-lg border-l-4 transition-all ${
        notification.status === 'unread' ? 'border-l-blue-500 bg-blue-50' : getNotificationColor(notification.pesan)
      } cursor-pointer hover:shadow-md`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          notification.status === 'unread' ? 'bg-blue-500 text-white' : getIconColor(notification.pesan)
        }`}>
          <span className="text-lg font-bold">{getNotificationIcon(notification.pesan)}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={`text-sm ${
                notification.status === 'unread' ? 'font-semibold text-gray-900' : 'text-gray-700'
              }`}>
                {notification.pesan}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(notification.tgl), {
                  addSuffix: true,
                  locale: localeId,
                })}
              </p>
            </div>

            {/* Status badge */}
            {notification.status === 'unread' && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded-full flex-shrink-0">
                Baru
              </span>
            )}
          </div>

          {/* Action buttons (shown when expanded) */}
          {isExpanded && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
              {notification.status === 'unread' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead();
                  }}
                  className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                >
                  Tandai sudah dibaca
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.notif_id);
                }}
                className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
