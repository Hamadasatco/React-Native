import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Surface, Button, List, Divider, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const HelpSupportScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    textAlign: 'right',
  } : {};
  
  // Handle opening chat
  const handleOpenChat = () => {
    navigation.navigate('Chat');
  };
  
  // Handle opening email
  const handleOpenEmail = () => {
    Linking.openURL('mailto:support@bustickets.app');
  };
  
  // Handle opening phone
  const handleOpenPhone = () => {
    Linking.openURL('tel:+18001234567');
  };
  
  // Handle opening FAQ
  const handleOpenFAQ = () => {
    // In a real app, navigate to FAQ screen or open web FAQ
    navigation.navigate('WebView', { url: 'https://bustickets.app/faq' });
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('help.contactUs')}</Text>
        <Text style={[styles.sectionDescription, rtlStyles]}>
          {t('help.contactDescription')}
        </Text>
        
        <List.Item
          title={t('help.chat')}
          description={t('help.chatDescription')}
          left={props => <List.Icon {...props} icon="chat" color="#1976D2" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleOpenChat}
          style={styles.listItem}
        />
        
        <Divider />
        
        <List.Item
          title={t('help.email')}
          description="support@bustickets.app"
          left={props => <List.Icon {...props} icon="email" color="#1976D2" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleOpenEmail}
          style={styles.listItem}
        />
        
        <Divider />
        
        <List.Item
          title={t('help.phone')}
          description="+1 (800) 123-4567"
          left={props => <List.Icon {...props} icon="phone" color="#1976D2" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleOpenPhone}
          style={styles.listItem}
        />
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('help.helpResources')}</Text>
        
        <List.Item
          title={t('help.faq')}
          description={t('help.faqDescription')}
          left={props => <List.Icon {...props} icon="frequently-asked-questions" color="#1976D2" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleOpenFAQ}
          style={styles.listItem}
        />
        
        <Divider />
        
        <List.Item
          title={t('help.userGuide')}
          description={t('help.userGuideDescription')}
          left={props => <List.Icon {...props} icon="book-open-variant" color="#1976D2" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
          style={styles.listItem}
        />
        
        <Divider />
        
        <List.Item
          title={t('help.videoTutorials')}
          description={t('help.videoTutorialsDescription')}
          left={props => <List.Icon {...props} icon="video" color="#1976D2" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
          style={styles.listItem}
        />
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('help.feedback')}</Text>
        <Text style={[styles.sectionDescription, rtlStyles]}>
          {t('help.feedbackDescription')}
        </Text>
        
        <Button
          mode="contained"
          icon="star"
          onPress={() => {}}
          style={styles.feedbackButton}
        >
          {t('help.rateApp')}
        </Button>
        
        <Button
          mode="outlined"
          icon="message-text"
          onPress={() => {}}
          style={styles.suggestionButton}
        >
          {t('help.sendSuggestion')}
        </Button>
      </Surface>
      
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        {t('common.back')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
  feedbackButton: {
    marginBottom: 12,
    backgroundColor: '#1976D2',
  },
  suggestionButton: {
    borderColor: '#1976D2',
  },
  backButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
  },
});

export default HelpSupportScreen;
