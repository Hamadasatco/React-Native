import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, Chip, Divider, List, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import ChatService from '../../services/chat/ChatService';

const ChatSettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL, language, changeLanguage } = useLanguage();
  
  // States
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [notifyNewMessages, setNotifyNewMessages] = useState(true);
  const [showTypingIndicator, setShowTypingIndicator] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load settings on mount
  useEffect(() => {
    loadSettings();
    loadChatHistory();
  }, []);
  
  // Load settings
  const loadSettings = async () => {
    try {
      // In a real app, these would be loaded from AsyncStorage
      // For now, we'll use default values
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  // Load chat history
  const loadChatHistory = async () => {
    try {
      const history = await ChatService.getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };
  
  // Save settings
  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, these would be saved to AsyncStorage
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsLoading(false);
    }
  };
  
  // Clear chat history
  const clearHistory = async () => {
    try {
      setIsLoading(true);
      await ChatService.clearChatHistory();
      setChatHistory([]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setIsLoading(false);
    }
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerContainer}>
        <Text style={[styles.headerTitle, rtlStyles]}>{t('chat.settings')}</Text>
        <Text style={[styles.headerSubtitle, rtlStyles]}>
          {t('chat.settingsDescription')}
        </Text>
      </Surface>
      
      <Surface style={styles.settingsContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('chat.languageSettings')}</Text>
        
        <List.Item
          title={t('chat.chatLanguage')}
          description={t('chat.chatLanguageDescription')}
          left={props => <List.Icon {...props} icon="translate" />}
          right={() => (
            <View style={styles.languageSelector}>
              <Chip
                selected={language === 'en'}
                onPress={() => changeLanguage('en')}
                style={language === 'en' ? styles.selectedLanguage : null}
              >
                English
              </Chip>
              <Chip
                selected={language === 'ar'}
                onPress={() => changeLanguage('ar')}
                style={[
                  styles.arabicChip,
                  language === 'ar' ? styles.selectedLanguage : null
                ]}
              >
                العربية
              </Chip>
            </View>
          )}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title={t('chat.autoTranslate')}
          description={t('chat.autoTranslateDescription')}
          left={props => <List.Icon {...props} icon="auto-fix" />}
          right={() => (
            <Switch
              value={autoTranslate}
              onValueChange={setAutoTranslate}
            />
          )}
        />
      </Surface>
      
      <Surface style={styles.settingsContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('chat.notificationSettings')}</Text>
        
        <List.Item
          title={t('chat.notifyNewMessages')}
          description={t('chat.notifyNewMessagesDescription')}
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notifyNewMessages}
              onValueChange={setNotifyNewMessages}
            />
          )}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title={t('chat.showTypingIndicator')}
          description={t('chat.showTypingIndicatorDescription')}
          left={props => <List.Icon {...props} icon="message-text" />}
          right={() => (
            <Switch
              value={showTypingIndicator}
              onValueChange={setShowTypingIndicator}
            />
          )}
        />
      </Surface>
      
      <Surface style={styles.settingsContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('chat.historySettings')}</Text>
        
        <View style={styles.historyInfo}>
          <Text style={rtlStyles}>
            {t('chat.messagesInHistory', { count: chatHistory.length })}
          </Text>
          
          <Button
            mode="outlined"
            onPress={clearHistory}
            disabled={chatHistory.length === 0 || isLoading}
            style={styles.clearButton}
          >
            {t('chat.clearHistory')}
          </Button>
        </View>
      </Surface>
      
      <Button
        mode="contained"
        onPress={saveSettings}
        loading={isLoading}
        style={styles.saveButton}
      >
        {t('common.saveSettings')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingsContainer: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  languageSelector: {
    flexDirection: 'row',
  },
  arabicChip: {
    marginLeft: 8,
  },
  selectedLanguage: {
    backgroundColor: '#E3F2FD',
  },
  historyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    borderColor: '#F44336',
  },
  saveButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: '#1976D2',
  },
});

export default ChatSettingsScreen;
