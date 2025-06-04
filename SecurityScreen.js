import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const SecurityScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Handle input change
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
    
    // Clear success message when editing
    if (isSuccess) {
      setIsSuccess(false);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate current password
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = t('validation.required');
    }
    
    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t('validation.required');
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t('validation.passwordLength');
    }
    
    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('validation.required');
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = t('validation.passwordMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle change password
  const handleChangePassword = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, we would dispatch an action to change the password
        setIsLoading(false);
        setIsSuccess(true);
        
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 1500);
    }
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    textAlign: 'right',
  } : {};

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('security.changePassword')}</Text>
        <Text style={[styles.sectionDescription, rtlStyles]}>
          {t('security.changePasswordDescription')}
        </Text>
        
        <TextInput
          label={t('security.currentPassword')}
          value={formData.currentPassword}
          onChangeText={(text) => handleChange('currentPassword', text)}
          style={styles.input}
          secureTextEntry
          error={!!errors.currentPassword}
          disabled={isLoading}
        />
        {errors.currentPassword && (
          <Text style={styles.errorText}>{errors.currentPassword}</Text>
        )}
        
        <TextInput
          label={t('security.newPassword')}
          value={formData.newPassword}
          onChangeText={(text) => handleChange('newPassword', text)}
          style={styles.input}
          secureTextEntry
          error={!!errors.newPassword}
          disabled={isLoading}
        />
        {errors.newPassword && (
          <Text style={styles.errorText}>{errors.newPassword}</Text>
        )}
        
        <TextInput
          label={t('security.confirmPassword')}
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          style={styles.input}
          secureTextEntry
          error={!!errors.confirmPassword}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
        
        {isSuccess && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{t('security.passwordChanged')}</Text>
          </View>
        )}
        
        <Button
          mode="contained"
          onPress={handleChangePassword}
          style={styles.changeButton}
          loading={isLoading}
          disabled={isLoading}
        >
          {t('security.changePassword')}
        </Button>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('security.accountSecurity')}</Text>
        
        <View style={[styles.securityPoint, rtlStyles]}>
          <IconButton icon="shield-account" size={24} color="#1976D2" />
          <View style={styles.securityPointContent}>
            <Text style={styles.securityPointTitle}>{t('security.twoFactorAuth')}</Text>
            <Text style={styles.securityPointDescription}>
              {t('security.twoFactorAuthDescription')}
            </Text>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.securityButton}
            >
              {t('security.enable')}
            </Button>
          </View>
        </View>
        
        <View style={[styles.securityPoint, rtlStyles]}>
          <IconButton icon="devices" size={24} color="#1976D2" />
          <View style={styles.securityPointContent}>
            <Text style={styles.securityPointTitle}>{t('security.deviceManagement')}</Text>
            <Text style={styles.securityPointDescription}>
              {t('security.deviceManagementDescription')}
            </Text>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.securityButton}
            >
              {t('security.manageDevices')}
            </Button>
          </View>
        </View>
        
        <View style={[styles.securityPoint, rtlStyles]}>
          <IconButton icon="account-remove" size={24} color="#F44336" />
          <View style={styles.securityPointContent}>
            <Text style={styles.securityPointTitle}>{t('security.deleteAccount')}</Text>
            <Text style={styles.securityPointDescription}>
              {t('security.deleteAccountDescription')}
            </Text>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.deleteButton}
            >
              {t('security.deleteAccount')}
            </Button>
          </View>
        </View>
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
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 4,
    marginVertical: 16,
  },
  successText: {
    color: '#2E7D32',
  },
  changeButton: {
    marginTop: 16,
    backgroundColor: '#1976D2',
  },
  securityPoint: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  securityPointContent: {
    flex: 1,
  },
  securityPointTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  securityPointDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  securityButton: {
    alignSelf: 'flex-start',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    borderColor: '#F44336',
  },
  backButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
  },
});

export default SecurityScreen;
