import React, { createContext, useState, useContext, useEffect } from 'react';
import { I18nManager } from 'react-native';
import i18n from '../i18n';

// Create the language context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }) => {
  // State for current language
  const [language, setLanguage] = useState(i18n.language || 'en');
  
  // Computed property for RTL
  const isRTL = language === 'ar';
  
  // Function to change language
  const changeLanguage = async (lang) => {
    try {
      // Change language in i18n
      await i18n.changeLanguage(lang);
      
      // Update RTL setting
      const shouldBeRTL = lang === 'ar';
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
      }
      
      // Update state
      setLanguage(lang);
      
      // Store language preference
      // In a real app, we would use AsyncStorage
      // AsyncStorage.setItem('userLanguage', lang);
      
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  };
  
  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        // In a real app, we would use AsyncStorage
        // const savedLanguage = await AsyncStorage.getItem('userLanguage');
        const savedLanguage = null; // Mock for now
        
        if (savedLanguage && savedLanguage !== language) {
          changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load saved language:', error);
      }
    };
    
    loadSavedLanguage();
  }, []);
  
  // Context value
  const contextValue = {
    language,
    isRTL,
    changeLanguage,
    t: i18n.t, // Shorthand for translation function
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
