import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages, isRTL } = useLanguage();

  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>{t('common.language')}</Text>
      <Divider style={styles.divider} />
      
      <View style={styles.languageOptions}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageOption,
              currentLanguage === language.code && styles.selectedLanguage
            ]}
            onPress={() => changeLanguage(language.code)}
          >
            <Text
              style={[
                styles.languageText,
                currentLanguage === language.code && styles.selectedLanguageText
              ]}
            >
              {language.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.directionText}>
        {isRTL ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)'}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  divider: {
    marginBottom: 16,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  languageOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  selectedLanguage: {
    backgroundColor: '#1976D2',
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  directionText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
  },
});

export default LanguageSwitcher;
