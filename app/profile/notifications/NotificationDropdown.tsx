//app/profile/notifications/NotificationDropdown.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import { fetchNotifications, deleteNotification, markNotificationsAsRead } from './notifications';
import { Notification } from '@/app/types';
import { MdClose } from 'react-icons/md';

const NotificationDropdown: React.FC = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function getNotifications() {
      if (!user?.id) return;

      setLoading(true);
      try {
        const notificationsData = await fetchNotifications(user.id);
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter((notification) => !notification.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    getNotifications();
  }, [user?.id]);

  const toggleDropdown = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0 && user) {
      await markNotificationsAsRead(user.id);
      setUnreadCount(0);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter((notification) => notification.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={toggleDropdown}>
        <FaBell size={24} className="text-white hover:text-orange-200 transition duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-md z-50">
          {loading ? (
            <div className="p-4  text-gray-800">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4  text-gray-800">You have no new notifications.</div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="p-4 border-b border-gray-200 flex justify-between items-center text-gray-800"
                >
                  <span>{notification.message}</span>
                  <MdClose
                    size={50}
                    className="text-orange-500 cursor-pointer hover:text-orange-600 transition duration-300"
                    onClick={() => handleDelete(notification.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;