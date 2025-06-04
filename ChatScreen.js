import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Surface, TextInput, IconButton, ActivityIndicator, Chip, Avatar, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import ChatService from '../../services/chat/ChatService';
import { v4 as uuidv4 } from 'uuid';

const ChatScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const flatListRef = useRef(null);
  
  const { userId } = route.params || { userId: 'user123' };
  
  // States
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState('offline');
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  // Initialize chat service
  useEffect(() => {
    const initChat = async () => {
      try {
        await ChatService.initialize(userId, language);
        
        // Load chat history
        const history = await ChatService.loadChatHistory();
        setMessages(history);
        
        // Get agent status
        try {
          const status = await ChatService.getSupportAgentStatus();
          setAgentStatus(status.status);
        } catch (error) {
          console.error('Error getting agent status:', error);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsLoading(false);
      }
    };
    
    initChat();
    
    // Set up listeners
    const messageUnsubscribe = ChatService.addMessageListener(handleNewMessage);
    const connectionUnsubscribe = ChatService.addConnectionListener(handleConnectionChange);
    const typingUnsubscribe = ChatService.addTypingListener(handleTypingIndicator);
    
    // Clean up on unmount
    return () => {
      messageUnsubscribe();
      connectionUnsubscribe();
      typingUnsubscribe();
      ChatService.disconnect();
    };
  }, [userId, language]);
  
  // Handle new message
  const handleNewMessage = (message) => {
    setMessages(prevMessages => {
      // Check if message already exists
      const exists = prevMessages.some(msg => msg.id === message.id);
      if (exists) {
        // Update existing message
        return prevMessages.map(msg => 
          msg.id === message.id ? message : msg
        );
      } else {
        // Add new message
        return [...prevMessages, message];
      }
    });
    
    // Scroll to bottom
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  // Handle connection change
  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
  };
  
  // Handle typing indicator
  const handleTypingIndicator = (data) => {
    // Only show typing indicator for agents
    if (data.userId !== userId) {
      setAgentTyping(data.isTyping);
    }
  };
  
  // Send message
  const sendMessage = async () => {
    if (!inputText.trim() || !isConnected) return;
    
    const messageText = inputText.trim();
    setInputText('');
    
    // Cancel typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    ChatService.sendTypingIndicator(false);
    setIsTyping(false);
    
    try {
      // Detect language
      const detectedLanguage = await ChatService.detectLanguage(messageText);
      
      // Create message object
      const message = {
        id: uuidv4(),
        text: messageText,
        senderId: userId,
        senderType: 'user',
        senderLanguage: detectedLanguage,
        timestamp: Date.now(),
        status: 'sending'
      };
      
      // Send message
      await ChatService.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Handle text input change
  const handleInputChange = (text) => {
    setInputText(text);
    
    // Send typing indicator
    if (!isTyping) {
      ChatService.sendTypingIndicator(true);
      setIsTyping(true);
    }
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      ChatService.sendTypingIndicator(false);
      setIsTyping(false);
    }, 3000);
    
    setTypingTimeout(timeout);
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get message status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending': return 'clock-outline';
      case 'sent': return 'check';
      case 'delivered': return 'check-all';
      case 'read': return 'check-all';
      case 'failed': return 'alert-circle';
      default: return 'check';
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'sending': return '#9E9E9E';
      case 'sent': return '#9E9E9E';
      case 'delivered': return '#2196F3';
      case 'read': return '#4CAF50';
      case 'failed': return '#F44336';
      default: return '#9E9E9E';
    }
  };
  
  // Get agent status color
  const getAgentStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FFC107';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };
  
  // Get agent status text
  const getAgentStatusText = (status) => {
    switch (status) {
      case 'online': return t('chat.agentOnline');
      case 'away': return t('chat.agentAway');
      case 'offline': return t('chat.agentOffline');
      default: return t('chat.agentOffline');
    }
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};
  
  // Render message item
  const renderMessageItem = ({ item }) => {
    const isUser = item.senderId === userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.agentMessageContainer,
        isRTL && isUser ? { alignSelf: 'flex-start' } : null,
        isRTL && !isUser ? { alignSelf: 'flex-end' } : null
      ]}>
        {!isUser && (
          <Avatar.Icon 
            size={36} 
            icon="headset" 
            style={styles.agentAvatar} 
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.agentBubble,
          isRTL && isUser ? styles.userBubbleRTL : null,
          isRTL && !isUser ? styles.agentBubbleRTL : null
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.agentMessageText
          ]}>
            {item.text}
          </Text>
          
          {item.translated && (
            <View style={styles.translationIndicator}>
              <IconButton 
                icon="translate" 
                size={12} 
                color="#1976D2" 
                style={styles.translationIcon} 
              />
              <Text style={styles.translatedText}>
                {t('chat.translated')}
              </Text>
            </View>
          )}
          
          <View style={[
            styles.messageFooter,
            isRTL ? { flexDirection: 'row-reverse' } : null
          ]}>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
            
            {isUser && (
              <IconButton 
                icon={getStatusIcon(item.status)} 
                size={12} 
                color={getStatusColor(item.status)} 
                style={styles.statusIcon} 
              />
            )}
          </View>
        </View>
      </View>
    );
  };
  
  // Render date separator
  const renderDateSeparator = (date) => (
    <View style={styles.dateSeparator}>
      <Divider style={styles.dateDivider} />
      <Text style={styles.dateText}>{date}</Text>
      <Divider style={styles.dateDivider} />
    </View>
  );
  
  // Process messages with date separators
  const processedMessages = () => {
    const result = [];
    let currentDate = null;
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        result.push({
          id: `date-${messageDate}`,
          type: 'date',
          date: messageDate
        });
      }
      
      result.push({
        ...message,
        type: 'message'
      });
    });
    
    return result;
  };
  
  // Render item based on type
  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return renderDateSeparator(item.date);
    } else {
      return renderMessageItem({ item });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Surface style={styles.headerContainer}>
        <View style={[styles.headerContent, rtlStyles]}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{t('chat.customerSupport')}</Text>
            <View style={[styles.statusContainer, rtlStyles]}>
              <View style={[styles.statusIndicator, { backgroundColor: getAgentStatusColor(agentStatus) }]} />
              <Text style={styles.statusText}>{getAgentStatusText(agentStatus)}</Text>
            </View>
          </View>
          
          <IconButton 
            icon="information-outline" 
            size={24} 
            onPress={() => {
              // Show chat info dialog
            }} 
          />
        </View>
      </Surface>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            style={styles.messagesList}
            data={processedMessages()}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContent}
            onLayout={() => {
              if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: false });
              }
            }}
          />
          
          {agentTyping && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>{t('chat.agentTyping')}</Text>
              <ActivityIndicator size="small" color="#1976D2" style={styles.typingIndicator} />
            </View>
          )}
          
          {!isConnected && (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineText}>{t('chat.connectionLost')}</Text>
            </View>
          )}
          
          <Surface style={styles.inputContainer}>
            <TextInput
              style={[styles.input, rtlStyles]}
              value={inputText}
              onChangeText={handleInputChange}
              placeholder={t('chat.typeMessage')}
              multiline
              maxLength={500}
              disabled={!isConnected}
            />
            
            <IconButton
              icon="send"
              size={24}
              color="#1976D2"
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!inputText.trim() || !isConnected}
            />
          </Surface>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  agentMessageContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  agentAvatar: {
    backgroundColor: '#1976D2',
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#1976D2',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    elevation: 1,
  },
  userBubbleRTL: {
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 4,
  },
  agentBubbleRTL: {
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 16,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  agentMessageText: {
    color: '#212121',
  },
  translationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  translationIcon: {
    margin: 0,
    padding: 0,
  },
  translatedText: {
    fontSize: 10,
    color: '#1976D2',
    fontStyle: 'italic',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusIcon: {
    margin: 0,
    padding: 0,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateDivider: {
    flex: 1,
    height: 1,
  },
  dateText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#9E9E9E',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginRight: 8,
  },
  typingIndicator: {
    marginLeft: 4,
  },
  offlineContainer: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  offlineText: {
    color: '#C62828',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    margin: 0,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
  },
});

export default ChatScreen;
