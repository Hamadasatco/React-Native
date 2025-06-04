import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class OfflineService {
  constructor() {
    this.isConnected = true;
    this.connectionListeners = [];
    this.setupNetworkListener();
  }

  /**
   * Set up network connectivity listener
   */
  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected;
      
      // Notify listeners if connection state changed
      if (wasConnected !== this.isConnected) {
        this.notifyConnectionListeners();
      }
      
      // If connection was restored, sync data
      if (!wasConnected && this.isConnected) {
        this.syncOfflineData();
      }
    });
  }

  /**
   * Add connection state change listener
   * @param {Function} listener - Listener function
   * @returns {Function} - Function to remove listener
   */
  addConnectionListener(listener) {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all connection listeners
   */
  notifyConnectionListeners() {
    this.connectionListeners.forEach(listener => {
      listener(this.isConnected);
    });
  }

  /**
   * Check if device is connected to the internet
   * @returns {Promise<boolean>} - Whether device is connected
   */
  async isNetworkConnected() {
    const state = await NetInfo.fetch();
    return state.isConnected;
  }

  /**
   * Cache map data for offline use
   * @param {string} region - Map region identifier
   * @param {Object} mapData - Map data to cache
   */
  async cacheMapData(region, mapData) {
    try {
      await AsyncStorage.setItem(`map_data_${region}`, JSON.stringify(mapData));
      
      // Store cache timestamp
      await AsyncStorage.setItem(`map_data_${region}_timestamp`, Date.now().toString());
      
      console.log(`Map data cached for region: ${region}`);
    } catch (error) {
      console.error('Error caching map data:', error);
    }
  }

  /**
   * Get cached map data
   * @param {string} region - Map region identifier
   * @returns {Promise<Object|null>} - Cached map data or null if not found
   */
  async getCachedMapData(region) {
    try {
      const data = await AsyncStorage.getItem(`map_data_${region}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached map data:', error);
      return null;
    }
  }

  /**
   * Check if cached map data is expired
   * @param {string} region - Map region identifier
   * @param {number} maxAgeMs - Maximum age in milliseconds
   * @returns {Promise<boolean>} - Whether cache is expired
   */
  async isMapCacheExpired(region, maxAgeMs = 86400000) { // Default: 24 hours
    try {
      const timestamp = await AsyncStorage.getItem(`map_data_${region}_timestamp`);
      if (!timestamp) return true;
      
      const cacheAge = Date.now() - parseInt(timestamp, 10);
      return cacheAge > maxAgeMs;
    } catch (error) {
      console.error('Error checking map cache expiration:', error);
      return true;
    }
  }

  /**
   * Cache bus location data
   * @param {string} bookingId - Booking ID
   * @param {Object} locationData - Location data to cache
   */
  async cacheBusLocation(bookingId, locationData) {
    try {
      await AsyncStorage.setItem(`bus_location_${bookingId}`, JSON.stringify({
        ...locationData,
        timestamp: Date.now()
      }));
      
      console.log(`Bus location cached for booking: ${bookingId}`);
    } catch (error) {
      console.error('Error caching bus location:', error);
    }
  }

  /**
   * Get cached bus location
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object|null>} - Cached location data or null if not found
   */
  async getCachedBusLocation(bookingId) {
    try {
      const data = await AsyncStorage.getItem(`bus_location_${bookingId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached bus location:', error);
      return null;
    }
  }

  /**
   * Cache route data
   * @param {string} originDestKey - Origin-destination key
   * @param {Object} routeData - Route data to cache
   */
  async cacheRouteData(originDestKey, routeData) {
    try {
      await AsyncStorage.setItem(`route_data_${originDestKey}`, JSON.stringify({
        ...routeData,
        timestamp: Date.now()
      }));
      
      console.log(`Route data cached for: ${originDestKey}`);
    } catch (error) {
      console.error('Error caching route data:', error);
    }
  }

  /**
   * Get cached route data
   * @param {string} originDestKey - Origin-destination key
   * @returns {Promise<Object|null>} - Cached route data or null if not found
   */
  async getCachedRouteData(originDestKey) {
    try {
      const data = await AsyncStorage.getItem(`route_data_${originDestKey}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached route data:', error);
      return null;
    }
  }

  /**
   * Cache traffic data
   * @param {string} routeKey - Route key
   * @param {Object} trafficData - Traffic data to cache
   */
  async cacheTrafficData(routeKey, trafficData) {
    try {
      await AsyncStorage.setItem(`traffic_data_${routeKey}`, JSON.stringify({
        ...trafficData,
        timestamp: Date.now()
      }));
      
      console.log(`Traffic data cached for route: ${routeKey}`);
    } catch (error) {
      console.error('Error caching traffic data:', error);
    }
  }

  /**
   * Get cached traffic data
   * @param {string} routeKey - Route key
   * @returns {Promise<Object|null>} - Cached traffic data or null if not found
   */
  async getCachedTrafficData(routeKey) {
    try {
      const data = await AsyncStorage.getItem(`traffic_data_${routeKey}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached traffic data:', error);
      return null;
    }
  }

  /**
   * Queue an action to be performed when online
   * @param {string} actionType - Type of action
   * @param {Object} actionData - Action data
   */
  async queueOfflineAction(actionType, actionData) {
    try {
      // Get existing queue
      const queueData = await AsyncStorage.getItem('offline_action_queue');
      const queue = queueData ? JSON.parse(queueData) : [];
      
      // Add new action to queue
      queue.push({
        type: actionType,
        data: actionData,
        timestamp: Date.now()
      });
      
      // Save updated queue
      await AsyncStorage.setItem('offline_action_queue', JSON.stringify(queue));
      
      console.log(`Action queued for offline: ${actionType}`);
    } catch (error) {
      console.error('Error queuing offline action:', error);
    }
  }

  /**
   * Get all queued offline actions
   * @returns {Promise<Array>} - Queued actions
   */
  async getQueuedActions() {
    try {
      const queueData = await AsyncStorage.getItem('offline_action_queue');
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Error getting queued actions:', error);
      return [];
    }
  }

  /**
   * Clear the offline action queue
   */
  async clearActionQueue() {
    try {
      await AsyncStorage.setItem('offline_action_queue', JSON.stringify([]));
      console.log('Offline action queue cleared');
    } catch (error) {
      console.error('Error clearing action queue:', error);
    }
  }

  /**
   * Sync offline data when connection is restored
   */
  async syncOfflineData() {
    try {
      console.log('Connection restored, syncing offline data...');
      
      // Process queued actions
      const actions = await this.getQueuedActions();
      
      if (actions.length > 0) {
        console.log(`Processing ${actions.length} queued actions`);
        
        // Process each action
        // This would typically involve API calls or other online operations
        // For now, we'll just log the actions
        actions.forEach(action => {
          console.log(`Processing queued action: ${action.type}`);
        });
        
        // Clear the queue after processing
        await this.clearActionQueue();
      }
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clearAllCachedData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cachesToClear = keys.filter(key => 
        key.startsWith('map_data_') || 
        key.startsWith('bus_location_') || 
        key.startsWith('route_data_') || 
        key.startsWith('traffic_data_')
      );
      
      if (cachesToClear.length > 0) {
        await AsyncStorage.multiRemove(cachesToClear);
        console.log(`Cleared ${cachesToClear.length} cached items`);
      }
    } catch (error) {
      console.error('Error clearing cached data:', error);
    }
  }
}

export default new OfflineService();
