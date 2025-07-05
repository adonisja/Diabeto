// utils/notificationUtils.ts

import * as Device from 'expo-device';

// Type definitions for better type safety
export interface NotificationContent {
    title: string;
    body: string;
    sound?: string;
    badge?: number;
    data?: any;
}

export interface NotificationTrigger {
    hour: number;
    minute: number;
    repeats: boolean;
}

export interface NotificationRequest {
    identifier?: string;
    content: NotificationContent;
    trigger: NotificationTrigger;
}

// Safe wrapper for expo-notifications
class NotificationService {
    private notificationsModule: any = null;
    private isAvailable = false;

    constructor() {
        // Initialize synchronously without async
        this.initializeNotifications();
    }

    private initializeNotifications() {
        try {
            // Try to import expo-notifications to handle missing module gracefully
            const Notifications = require('expo-notifications');
            this.notificationsModule = Notifications;
            this.isAvailable = true;
            
            // Configure notification handler
            this.notificationsModule.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });
        } catch (error) {
            console.warn('Expo Notifications not available:', error);
            this.isAvailable = false;
        }
    }

    async getPermissionsAsync() {
        if (!this.isAvailable) {
            return { status: 'denied' };
        }
        
        try {
            // Check if we're on a physical device
            if (!Device.isDevice) {
                return { status: 'denied' };
            }
            return await this.notificationsModule.getPermissionsAsync();
        } catch (error) {
            console.error('Error getting notification permissions:', error);
            return { status: 'denied' };
        }
    }

    async requestPermissionsAsync() {
        if (!this.isAvailable) {
            return { status: 'denied' };
        }
        
        try {
            // Check if we're on a physical device
            if (!Device.isDevice) {
                return { status: 'denied' };
            }
            return await this.notificationsModule.requestPermissionsAsync();
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return { status: 'denied' };
        }
    }

    async scheduleNotificationAsync(request: NotificationRequest) {
        if (!this.isAvailable) {
            console.warn('Notifications not available, skipping schedule');
            return null;
        }
        
        try {
            return await this.notificationsModule.scheduleNotificationAsync(request);
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return null;
        }
    }

    async cancelAllScheduledNotificationsAsync() {
        if (!this.isAvailable) {
            console.warn('Notifications not available, skipping cancel');
            return;
        }
        
        try {
            await this.notificationsModule.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Error canceling notifications:', error);
        }
    }

    getIsAvailable() {
        return this.isAvailable;
    }
}

// Export a singleton instance
export const notificationService = new NotificationService();
