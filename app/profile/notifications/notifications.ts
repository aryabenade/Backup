//app/profile/notifications/notifications.ts
"use server";

import { PrismaClient } from '@prisma/client';
import { Notification } from '@/app/types';

const prisma = new PrismaClient();

// Function to create a notification
export async function createNotification(userId: string, petId: number, message: string): Promise<Notification> {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        petId,
        message,
        read: false, // Initialize as unread
      },
    });
    return notification;
  } catch (error) {
    throw new Error('Error creating notification');
  }
}

// Function to fetch notifications for a user
export async function fetchNotifications(userId: string): Promise<Notification[]> {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications;
  } catch (error) {
    throw new Error('Error fetching notifications');
  }
}

// Function to delete a notification
export async function deleteNotification(notificationId: number): Promise<void> {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
  } catch (error) {
    throw new Error('Error deleting notification');
  }
}

// Function to mark notifications as read
export async function markNotificationsAsRead(userId: string): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    throw new Error('Error marking notifications as read');
  }
}

