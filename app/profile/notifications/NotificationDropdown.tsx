
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
  const [loading, setLoading] = useState(true); // Loading state
  const [unreadCount, setUnreadCount] = useState(0); // Unread notifications count

  useEffect(() => {
    if (!user) return; // Ensure user is defined before fetching notifications

    async function getNotifications() {
      if (!user?.id) return; // Additional check to ensure user.id is defined

      setLoading(true); // Start loading
      try {
        const notificationsData = await fetchNotifications(user.id);
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter(notification => !notification.read).length); // Set unread notifications count
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // End loading
      }
    }
    getNotifications();
  }, [user?.id]); // Ensure this array includes user?.id to trigger effect when it changes

  const toggleDropdown = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0 && user) {
      // Mark notifications as read when dropdown is opened
      await markNotificationsAsRead(user.id);
      setUnreadCount(0);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={toggleDropdown}>
        <FaBell size={24} className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50">
          {loading ? (
            <div className="p-2">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-2">You have no new notifications.</div>
          ) : (
            <ul>
              {notifications.map(notification => (
                <li key={notification.id} className="p-2 border-b border-gray-200 flex justify-between items-center">
                  <span>{notification.message}</span>
                  <MdClose size={50} className="text-black cursor-pointer" onClick={() => handleDelete(notification.id)} />
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
