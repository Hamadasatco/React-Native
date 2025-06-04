import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Translate } from '@google-cloud/translate/build/src/v2';

class ChatService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.messageListeners = [];
    this.connectionListeners = [];
    this.typingListeners = [];
    this.translate = new Translate({
      projectId: 'bus-tickets-app',
      key: 'YOUR_TRANSLATION_API_KEY' // Would use environment variables in production
    });
    this.userLanguage = 'en'; // Default language
  }

  /**
   * Initialize chat service
   * @param {string} userId - User ID
   * @param {string} language - User language code
   * @returns {Promise<void>}
   */
  async initialize(userId, language = 'en') {
    this.userId = userId;
    this.userLanguage = language;
    
    // Load chat history from storage
    await this.loadChatHistory();
    
    // Connect to chat server
    this.connect();
  }

  /**
   * Connect to chat server
   */
  connect() {
    // Initialize socket connection
    this.socket = io('https://api.bustickets.app/chat', {
      query: {
        userId: this.userId,
        language: this.userLanguage
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    });
    
    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.connected = true;
      this.notifyConnectionListeners(true);
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.connected = false;
      this.notifyConnectionListeners(false);
    });
    
    this.socket.on('message', async (message) => {
      // Translate message if needed
      const translatedMessage = await this.translateMessageIfNeeded(message);
      
      // Store message in history
      await this.storeMessage(translatedMessage);
      
      // Notify listeners
      this.notifyMessageListeners(translatedMessage);
    });
    
    this.socket.on('typing', (data) => {
      this.notifyTypingListeners(data);
    });
    
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Disconnect from chat server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Send a message
   * @param {Object} message - Message object
   * @returns {Promise<Object>} - Sent message
   */
  async sendMessage(message) {
    if (!this.connected) {
      throw new Error('Not connected to chat server');
    }
    
    // Add metadata
    const messageWithMetadata = {
      ...message,
      senderId: this.userId,
      senderLanguage: this.userLanguage,
      timestamp: Date.now(),
      status: 'sending'
    };
    
    // Store message in history
    await this.storeMessage(messageWithMetadata);
    
    // Notify listeners
    this.notifyMessageListeners(messageWithMetadata);
    
    // Send message to server
    return new Promise((resolve, reject) => {
      this.socket.emit('message', messageWithMetadata, (response) => {
        if (response.error) {
          console.error('Error sending message:', response.error);
          
          // Update message status
          this.updateMessageStatus(messageWithMetadata.id, 'failed');
          
          reject(new Error(response.error));
        } else {
          // Update message status
          this.updateMessageStatus(messageWithMetadata.id, 'sent');
          
          resolve(messageWithMetadata);
        }
      });
    });
  }

  /**
   * Send typing indicator
   * @param {boolean} isTyping - Whether user is typing
   */
  sendTypingIndicator(isTyping) {
    if (!this.connected) return;
    
    this.socket.emit('typing', {
      userId: this.userId,
      isTyping
    });
  }

  /**
   * Add message listener
   * @param {Function} listener - Message listener function
   * @returns {Function} - Function to remove listener
   */
  addMessageListener(listener) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  /**
   * Add connection listener
   * @param {Function} listener - Connection listener function
   * @returns {Function} - Function to remove listener
   */
  addConnectionListener(listener) {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  /**
   * Add typing listener
   * @param {Function} listener - Typing listener function
   * @returns {Function} - Function to remove listener
   */
  addTypingListener(listener) {
    this.typingListeners.push(listener);
    return () => {
      this.typingListeners = this.typingListeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify message listeners
   * @param {Object} message - Message object
   */
  notifyMessageListeners(message) {
    this.messageListeners.forEach(listener => {
      listener(message);
    });
  }

  /**
   * Notify connection listeners
   * @param {boolean} connected - Connection status
   */
  notifyConnectionListeners(connected) {
    this.connectionListeners.forEach(listener => {
      listener(connected);
    });
  }

  /**
   * Notify typing listeners
   * @param {Object} data - Typing data
   */
  notifyTypingListeners(data) {
    this.typingListeners.forEach(listener => {
      listener(data);
    });
  }

  /**
   * Load chat history from storage
   * @returns {Promise<Array>} - Chat history
   */
  async loadChatHistory() {
    try {
      const history = await AsyncStorage.getItem(`chat_history_${this.userId}`);
      this.chatHistory = history ? JSON.parse(history) : [];
      return this.chatHistory;
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.chatHistory = [];
      return [];
    }
  }

  /**
   * Get chat history
   * @returns {Array} - Chat history
   */
  getChatHistory() {
    return this.chatHistory || [];
  }

  /**
   * Store message in history
   * @param {Object} message - Message object
   */
  async storeMessage(message) {
    try {
      // Add to memory
      if (!this.chatHistory) this.chatHistory = [];
      this.chatHistory.push(message);
      
      // Save to storage
      await AsyncStorage.setItem(
        `chat_history_${this.userId}`,
        JSON.stringify(this.chatHistory)
      );
    } catch (error) {
      console.error('Error storing message:', error);
    }
  }

  /**
   * Update message status
   * @param {string} messageId - Message ID
   * @param {string} status - New status
   */
  async updateMessageStatus(messageId, status) {
    try {
      // Update in memory
      if (!this.chatHistory) return;
      
      const updatedHistory = this.chatHistory.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, status };
        }
        return msg;
      });
      
      this.chatHistory = updatedHistory;
      
      // Save to storage
      await AsyncStorage.setItem(
        `chat_history_${this.userId}`,
        JSON.stringify(updatedHistory)
      );
      
      // Notify listeners
      const updatedMessage = this.chatHistory.find(msg => msg.id === messageId);
      if (updatedMessage) {
        this.notifyMessageListeners(updatedMessage);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }

  /**
   * Clear chat history
   */
  async clearChatHistory() {
    try {
      this.chatHistory = [];
      await AsyncStorage.removeItem(`chat_history_${this.userId}`);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  /**
   * Detect language of text
   * @param {string} text - Text to detect language of
   * @returns {Promise<string>} - Language code
   */
  async detectLanguage(text) {
    try {
      const [detection] = await this.translate.detect(text);
      return detection.language;
    } catch (error) {
      console.error('Error detecting language:', error);
      return this.userLanguage; // Default to user language
    }
  }

  /**
   * Translate text
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<string>} - Translated text
   */
  async translateText(text, targetLanguage) {
    try {
      const [translation] = await this.translate.translate(text, targetLanguage);
      return translation;
    } catch (error) {
      console.error('Error translating text:', error);
      return text; // Return original text on error
    }
  }

  /**
   * Translate message if needed
   * @param {Object} message - Message object
   * @returns {Promise<Object>} - Translated message
   */
  async translateMessageIfNeeded(message) {
    // Don't translate if message is already in user's language
    if (message.senderLanguage === this.userLanguage) {
      return message;
    }
    
    try {
      // Translate message text
      const translatedText = await this.translateText(message.text, this.userLanguage);
      
      return {
        ...message,
        originalText: message.text,
        text: translatedText,
        translated: true
      };
    } catch (error) {
      console.error('Error translating message:', error);
      return {
        ...message,
        translationFailed: true
      };
    }
  }

  /**
   * Set user language
   * @param {string} language - Language code
   */
  setUserLanguage(language) {
    this.userLanguage = language;
    
    // Update socket connection with new language
    if (this.socket && this.connected) {
      this.socket.io.opts.query = {
        ...this.socket.io.opts.query,
        language
      };
    }
  }

  /**
   * Get support agent status
   * @returns {Promise<Object>} - Agent status
   */
  async getSupportAgentStatus() {
    if (!this.connected) {
      throw new Error('Not connected to chat server');
    }
    
    return new Promise((resolve, reject) => {
      this.socket.emit('agent_status', {}, (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }
}

export default new ChatService();
