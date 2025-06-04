import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import Share from 'react-native-share';

class SharingService {
  constructor() {
    this.baseShareUrl = 'https://bustickets.app/track/';
    this.activeShares = {};
  }

  /**
   * Generate a secure sharing token
   * @param {number} expiryMinutes - Token expiry time in minutes
   * @returns {string} - Secure token
   */
  generateToken(expiryMinutes = 60) {
    // Generate a unique token
    const token = uuidv4();
    
    // Set expiry time
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
    
    return {
      token,
      expiryTime: expiryTime.getTime()
    };
  }

  /**
   * Create a shareable link for bus tracking
   * @param {string} bookingId - Booking ID
   * @param {Object} busInfo - Bus information
   * @param {number} expiryMinutes - Link expiry time in minutes
   * @returns {Promise<Object>} - Sharing information
   */
  async createSharingLink(bookingId, busInfo, expiryMinutes = 60) {
    try {
      // Generate token
      const { token, expiryTime } = this.generateToken(expiryMinutes);
      
      // Create share data
      const shareData = {
        bookingId,
        busInfo,
        createdAt: Date.now(),
        expiryTime,
        token
      };
      
      // Save share data
      await this.saveShareData(token, shareData);
      
      // Add to active shares
      this.activeShares[token] = shareData;
      
      // Create shareable link
      const shareLink = `${this.baseShareUrl}${token}`;
      
      return {
        token,
        shareLink,
        expiryTime,
        shareData
      };
    } catch (error) {
      console.error('Error creating sharing link:', error);
      throw new Error('Failed to create sharing link');
    }
  }

  /**
   * Save share data to storage
   * @param {string} token - Share token
   * @param {Object} shareData - Share data
   */
  async saveShareData(token, shareData) {
    try {
      await AsyncStorage.setItem(`share_${token}`, JSON.stringify(shareData));
      
      // Update active shares list
      const activeSharesList = await this.getActiveSharesList();
      activeSharesList.push(token);
      await AsyncStorage.setItem('active_shares', JSON.stringify(activeSharesList));
      
      console.log(`Share data saved for token: ${token}`);
    } catch (error) {
      console.error('Error saving share data:', error);
      throw error;
    }
  }

  /**
   * Get active shares list
   * @returns {Promise<Array>} - List of active share tokens
   */
  async getActiveSharesList() {
    try {
      const activeShares = await AsyncStorage.getItem('active_shares');
      return activeShares ? JSON.parse(activeShares) : [];
    } catch (error) {
      console.error('Error getting active shares list:', error);
      return [];
    }
  }

  /**
   * Get share data by token
   * @param {string} token - Share token
   * @returns {Promise<Object|null>} - Share data or null if not found or expired
   */
  async getShareData(token) {
    try {
      // Check memory cache first
      if (this.activeShares[token]) {
        const cachedData = this.activeShares[token];
        
        // Check if expired
        if (cachedData.expiryTime < Date.now()) {
          // Expired, remove from cache and storage
          await this.revokeShare(token);
          return null;
        }
        
        return cachedData;
      }
      
      // Not in memory, check storage
      const shareData = await AsyncStorage.getItem(`share_${token}`);
      if (!shareData) return null;
      
      const parsedData = JSON.parse(shareData);
      
      // Check if expired
      if (parsedData.expiryTime < Date.now()) {
        // Expired, remove from storage
        await this.revokeShare(token);
        return null;
      }
      
      // Add to memory cache
      this.activeShares[token] = parsedData;
      
      return parsedData;
    } catch (error) {
      console.error('Error getting share data:', error);
      return null;
    }
  }

  /**
   * Revoke a shared link
   * @param {string} token - Share token
   */
  async revokeShare(token) {
    try {
      // Remove from storage
      await AsyncStorage.removeItem(`share_${token}`);
      
      // Remove from memory cache
      delete this.activeShares[token];
      
      // Update active shares list
      const activeSharesList = await this.getActiveSharesList();
      const updatedList = activeSharesList.filter(t => t !== token);
      await AsyncStorage.setItem('active_shares', JSON.stringify(updatedList));
      
      console.log(`Share revoked: ${token}`);
    } catch (error) {
      console.error('Error revoking share:', error);
      throw error;
    }
  }

  /**
   * Get all active shares
   * @returns {Promise<Array>} - List of active shares
   */
  async getAllActiveShares() {
    try {
      const activeSharesList = await this.getActiveSharesList();
      const activeShares = [];
      
      // Get data for each share
      for (const token of activeSharesList) {
        const shareData = await this.getShareData(token);
        if (shareData) {
          activeShares.push({
            token,
            shareLink: `${this.baseShareUrl}${token}`,
            ...shareData
          });
        }
      }
      
      return activeShares;
    } catch (error) {
      console.error('Error getting all active shares:', error);
      return [];
    }
  }

  /**
   * Clean up expired shares
   */
  async cleanupExpiredShares() {
    try {
      const activeSharesList = await this.getActiveSharesList();
      const now = Date.now();
      const validShares = [];
      
      for (const token of activeSharesList) {
        const shareData = await AsyncStorage.getItem(`share_${token}`);
        if (shareData) {
          const parsedData = JSON.parse(shareData);
          
          if (parsedData.expiryTime > now) {
            // Still valid
            validShares.push(token);
          } else {
            // Expired, remove
            await AsyncStorage.removeItem(`share_${token}`);
            delete this.activeShares[token];
          }
        }
      }
      
      // Update active shares list
      await AsyncStorage.setItem('active_shares', JSON.stringify(validShares));
      
      console.log(`Cleaned up expired shares. Valid shares: ${validShares.length}`);
    } catch (error) {
      console.error('Error cleaning up expired shares:', error);
    }
  }

  /**
   * Share bus location via native sharing
   * @param {string} shareLink - Shareable link
   * @param {string} busOperator - Bus operator name
   * @param {Object} options - Additional sharing options
   * @returns {Promise<Object>} - Share result
   */
  async shareBusLocation(shareLink, busOperator, options = {}) {
    try {
      const shareOptions = {
        title: 'Share Bus Location',
        message: `Track my bus journey with ${busOperator}. Click the link to view live location: ${shareLink}`,
        url: shareLink,
        ...options
      };
      
      const result = await Share.open(shareOptions);
      return result;
    } catch (error) {
      console.error('Error sharing bus location:', error);
      throw error;
    }
  }

  /**
   * Update shared location data
   * @param {string} token - Share token
   * @param {Object} locationData - Updated location data
   */
  async updateSharedLocation(token, locationData) {
    try {
      // Get existing share data
      const shareData = await this.getShareData(token);
      if (!shareData) {
        throw new Error('Share not found or expired');
      }
      
      // Update location data
      const updatedShareData = {
        ...shareData,
        locationData: {
          ...locationData,
          lastUpdated: Date.now()
        }
      };
      
      // Save updated data
      await AsyncStorage.setItem(`share_${token}`, JSON.stringify(updatedShareData));
      
      // Update memory cache
      this.activeShares[token] = updatedShareData;
      
      console.log(`Shared location updated for token: ${token}`);
    } catch (error) {
      console.error('Error updating shared location:', error);
      throw error;
    }
  }

  /**
   * Handle deep link for shared location
   * @param {string} url - Deep link URL
   * @returns {Promise<Object|null>} - Share data or null if invalid
   */
  async handleDeepLink(url) {
    try {
      // Extract token from URL
      const urlParts = url.split('/');
      const token = urlParts[urlParts.length - 1];
      
      if (!token) return null;
      
      // Get share data
      return await this.getShareData(token);
    } catch (error) {
      console.error('Error handling deep link:', error);
      return null;
    }
  }
}

export default new SharingService();
