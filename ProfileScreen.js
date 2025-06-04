import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Surface, Button, Avatar, TextInput, IconButton, Divider, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'react-native-image-picker';

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL, language, changeLanguage } = useLanguage();
  const dispatch = useDispatch();
  
  // Mock profile data - would come from Redux in a real app
  const [profile, setProfile] = useState({
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profileImage: null,
    dateOfBirth: '1990-01-01',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    preferences: {
      language: language,
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      travelPreferences: {
        seatType: 'window',
        specialRequirements: []
      }
    },
    paymentMethods: [
      {
        id: 'pm1',
        type: 'credit',
        cardNumber: '****4567',
        cardHolder: 'John Doe',
        expiryDate: '12/25',
        isDefault: true
      }
    ],
    createdAt: '2023-01-15T10:30:00Z',
    lastLogin: '2025-05-31T09:15:00Z'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};
  
  // Handle profile image selection
  const handleSelectImage = () => {
    const options = {
      title: t('profile.selectPhoto'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // In a real app, we would upload this image to a server
        // For now, we'll just update the local state
        setProfile({
          ...profile,
          profileImage: response.assets[0].uri
        });
      }
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Navigate to edit profile
  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile', { profile });
  };
  
  // Navigate to preferences
  const navigateToPreferences = () => {
    navigation.navigate('Preferences', { preferences: profile.preferences });
  };
  
  // Navigate to payment methods
  const navigateToPaymentMethods = () => {
    navigation.navigate('PaymentMethods', { paymentMethods: profile.paymentMethods });
  };
  
  // Navigate to security settings
  const navigateToSecurity = () => {
    navigation.navigate('Security');
  };
  
  // Navigate to help & support
  const navigateToHelpSupport = () => {
    navigation.navigate('HelpSupport');
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsLoading(true);
    
    // Simulate logout process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, we would dispatch a logout action
      // and navigate to the login screen
      navigation.navigate('Login');
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleSelectImage}>
            {profile.profileImage ? (
              <Avatar.Image 
                source={{ uri: profile.profileImage }} 
                size={80} 
                style={styles.profileImage}
              />
            ) : (
              <Avatar.Text 
                size={80} 
                label={`${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`}
                style={styles.profileImage}
              />
            )}
            <View style={styles.editImageButton}>
              <IconButton 
                icon="camera" 
                size={16} 
                onPress={handleSelectImage}
                style={styles.editImageIcon}
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <Text style={styles.profilePhone}>{profile.phone}</Text>
          </View>
        </View>
        
        <Button 
          mode="contained" 
          onPress={navigateToEditProfile}
          style={styles.editProfileButton}
          icon="account-edit"
        >
          {t('profile.editProfile')}
        </Button>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('profile.accountInfo')}</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.memberSince')}</Text>
          <Text style={styles.infoValue}>{formatDate(profile.createdAt)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.lastLogin')}</Text>
          <Text style={styles.infoValue}>{formatDate(profile.lastLogin)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.language')}</Text>
          <View style={styles.languageSelector}>
            <Button 
              mode={language === 'en' ? 'contained' : 'outlined'}
              onPress={() => changeLanguage('en')}
              style={styles.languageButton}
              compact
            >
              English
            </Button>
            <Button 
              mode={language === 'ar' ? 'contained' : 'outlined'}
              onPress={() => changeLanguage('ar')}
              style={styles.languageButton}
              compact
            >
              العربية
            </Button>
          </View>
        </View>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('profile.settings')}</Text>
        
        <TouchableOpacity 
          style={[styles.settingsItem, rtlStyles]} 
          onPress={navigateToPreferences}
        >
          <View style={[styles.settingsIconContainer, isRTL && styles.iconRTL]}>
            <IconButton icon="tune" size={24} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>{t('profile.preferences')}</Text>
            <Text style={styles.settingsItemDescription}>{t('profile.preferencesDescription')}</Text>
          </View>
          <IconButton 
            icon={isRTL ? "chevron-left" : "chevron-right"} 
            size={24} 
            color="#9E9E9E"
          />
        </TouchableOpacity>
        
        <Divider style={styles.divider} />
        
        <TouchableOpacity 
          style={[styles.settingsItem, rtlStyles]} 
          onPress={navigateToPaymentMethods}
        >
          <View style={[styles.settingsIconContainer, isRTL && styles.iconRTL]}>
            <IconButton icon="credit-card" size={24} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>{t('profile.paymentMethods')}</Text>
            <Text style={styles.settingsItemDescription}>{t('profile.paymentMethodsDescription')}</Text>
          </View>
          <IconButton 
            icon={isRTL ? "chevron-left" : "chevron-right"} 
            size={24} 
            color="#9E9E9E"
          />
        </TouchableOpacity>
        
        <Divider style={styles.divider} />
        
        <TouchableOpacity 
          style={[styles.settingsItem, rtlStyles]} 
          onPress={navigateToSecurity}
        >
          <View style={[styles.settingsIconContainer, isRTL && styles.iconRTL]}>
            <IconButton icon="shield-account" size={24} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>{t('profile.security')}</Text>
            <Text style={styles.settingsItemDescription}>{t('profile.securityDescription')}</Text>
          </View>
          <IconButton 
            icon={isRTL ? "chevron-left" : "chevron-right"} 
            size={24} 
            color="#9E9E9E"
          />
        </TouchableOpacity>
        
        <Divider style={styles.divider} />
        
        <TouchableOpacity 
          style={[styles.settingsItem, rtlStyles]} 
          onPress={navigateToHelpSupport}
        >
          <View style={[styles.settingsIconContainer, isRTL && styles.iconRTL]}>
            <IconButton icon="help-circle" size={24} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>{t('profile.helpSupport')}</Text>
            <Text style={styles.settingsItemDescription}>{t('profile.helpSupportDescription')}</Text>
          </View>
          <IconButton 
            icon={isRTL ? "chevron-left" : "chevron-right"} 
            size={24} 
            color="#9E9E9E"
          />
        </TouchableOpacity>
      </Surface>
      
      <Button 
        mode="outlined" 
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
        loading={isLoading}
        disabled={isLoading}
      >
        {t('profile.logout')}
      </Button>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          {t('profile.version')} 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    backgroundColor: '#1976D2',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1976D2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageIcon: {
    margin: 0,
    padding: 0,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
  },
  editProfileButton: {
    backgroundColor: '#1976D2',
  },
  sectionContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageButton: {
    marginLeft: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingsIconContainer: {
    marginRight: 8,
  },
  iconRTL: {
    marginRight: 0,
    marginLeft: 8,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsItemDescription: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    marginVertical: 8,
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    borderColor: '#F44336',
    borderWidth: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
});

export default ProfileScreen;
