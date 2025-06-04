import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationService from '../../services/notification/NotificationService';
import TrafficService from '../../services/traffic/TrafficService';

const NotificationIntegrationService = {
  /**
   * Initialize bus status notifications
   * @param {string} bookingId - Booking ID
   * @param {Object} busLocation - Bus location
   * @param {Object} destination - Destination
   * @param {Object} userLocation - User location
   */
  initializeBusStatusNotifications: async (bookingId, busLocation, destination, userLocation) => {
    // Subscribe to bus updates
    await NotificationService.subscribeToBusUpdates(bookingId);
    
    // Set up periodic status checks
    const checkInterval = setInterval(async () => {
      try {
        // Get traffic data
        const trafficData = await TrafficService.getTrafficAlongRoute(
          busLocation,
          destination
        );
        
        // Check for significant delays
        if (trafficData.delayMinutes > 10) {
          // Send delay notification
          const delayNotification = {
            id: `delay_${bookingId}_${Date.now()}`,
            title: 'Bus Delay Alert',
            body: `Your bus is delayed by ${trafficData.delayMinutes} minutes due to traffic.`,
            type: 'delay_alert',
            bookingId,
            delayMinutes: trafficData.delayMinutes,
            timestamp: Date.now(),
            read: false
          };
          
          // Store notification
          await NotificationService.storeNotification(delayNotification);
        }
        
        // Calculate ETA
        const etaData = await TrafficService.calculateETA(
          busLocation,
          destination
        );
        
        // Check if bus is arriving soon (within 10 minutes)
        if (etaData.durationInTraffic < 600) { // 10 minutes in seconds
          // Send arrival notification
          const arrivalNotification = {
            id: `arrival_${bookingId}_${Date.now()}`,
            title: 'Bus Arriving Soon',
            body: 'Your bus will arrive at the destination in less than 10 minutes.',
            type: 'arrival_alert',
            bookingId,
            arrivalTime: etaData.arrivalTime,
            timestamp: Date.now(),
            read: false
          };
          
          // Store notification
          await NotificationService.storeNotification(arrivalNotification);
        }
        
        // Check for traffic incidents
        const incidents = await TrafficService.getTrafficIncidents(busLocation);
        
        if (incidents.length > 0) {
          // Send incident notification
          const incidentNotification = {
            id: `incident_${bookingId}_${Date.now()}`,
            title: 'Traffic Incident Alert',
            body: `${incidents.length} traffic incident(s) detected on your route.`,
            type: 'status_update',
            bookingId,
            status: 'incident',
            timestamp: Date.now(),
            read: false
          };
          
          // Store notification
          await NotificationService.storeNotification(incidentNotification);
        }
      } catch (error) {
        console.error('Error checking bus status:', error);
      }
    }, 300000); // Check every 5 minutes
    
    // Return cleanup function
    return () => clearInterval(checkInterval);
  },
  
  /**
   * Schedule departure reminders
   * @param {string} bookingId - Booking ID
   * @param {string} departureTime - Departure time (ISO string)
   */
  scheduleDepartureReminders: async (bookingId, departureTime) => {
    try {
      // Get user preferences
      const preferences = await NotificationService.getNotificationPreferences();
      
      if (!preferences.departureReminders) {
        return; // User has disabled departure reminders
      }
      
      const departureDate = new Date(departureTime);
      const now = new Date();
      
      // Schedule 24h reminder
      if (preferences.reminderTimes['24h']) {
        const reminder24h = new Date(departureDate);
        reminder24h.setHours(reminder24h.getHours() - 24);
        
        if (reminder24h > now) {
          // Create reminder notification
          const reminderNotification = {
            id: `reminder_24h_${bookingId}`,
            title: 'Departure Reminder',
            body: 'Your bus departs in 24 hours.',
            type: 'departure_reminder',
            bookingId,
            departureTime,
            timestamp: reminder24h.getTime(),
            read: false
          };
          
          // Store notification (will be shown at the appropriate time)
          await NotificationService.storeNotification(reminderNotification);
        }
      }
      
      // Schedule 1h reminder
      if (preferences.reminderTimes['1h']) {
        const reminder1h = new Date(departureDate);
        reminder1h.setHours(reminder1h.getHours() - 1);
        
        if (reminder1h > now) {
          // Create reminder notification
          const reminderNotification = {
            id: `reminder_1h_${bookingId}`,
            title: 'Departure Reminder',
            body: 'Your bus departs in 1 hour.',
            type: 'departure_reminder',
            bookingId,
            departureTime,
            timestamp: reminder1h.getTime(),
            read: false
          };
          
          // Store notification
          await NotificationService.storeNotification(reminderNotification);
        }
      }
      
      // Schedule 30min reminder
      if (preferences.reminderTimes['30min']) {
        const reminder30min = new Date(departureDate);
        reminder30min.setMinutes(reminder30min.getMinutes() - 30);
        
        if (reminder30min > now) {
          // Create reminder notification
          const reminderNotification = {
            id: `reminder_30min_${bookingId}`,
            title: 'Departure Reminder',
            body: 'Your bus departs in 30 minutes.',
            type: 'departure_reminder',
            bookingId,
            departureTime,
            timestamp: reminder30min.getTime(),
            read: false
          };
          
          // Store notification
          await NotificationService.storeNotification(reminderNotification);
        }
      }
    } catch (error) {
      console.error('Error scheduling departure reminders:', error);
    }
  }
};

export default NotificationIntegrationService;
