import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Surface, Button, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const EditProfileScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Get profile from route params
  const { profile } = route.params || {
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    }
  };
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    dateOfBirth: profile.dateOfBirth || '',
    street: profile.address?.street || '',
    city: profile.address?.city || '',
    state: profile.address?.state || '',
    postalCode: profile.address?.postalCode || '',
    country: profile.address?.country || ''
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
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
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('validation.required');
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('validation.required');
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required');
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
      newErrors.phone = t('validation.invalidPhone');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, we would dispatch an action to update the profile
        const updatedProfile = {
          ...profile,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country
          }
        };
        
        setIsLoading(false);
        navigation.navigate('Profile', { updatedProfile });
      }, 1000);
    }
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    textAlign: 'right',
  } : {};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.formContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('profile.personalInfo')}</Text>
          
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <TextInput
                label={t('profile.firstName')}
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                style={styles.input}
                error={!!errors.firstName}
                disabled={isLoading}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>
            
            <View style={styles.formField}>
              <TextInput
                label={t('profile.lastName')}
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                style={styles.input}
                error={!!errors.lastName}
                disabled={isLoading}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>
          </View>
          
          <TextInput
            label={t('profile.email')}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            style={[styles.input, styles.fullWidthInput]}
            keyboardType="email-address"
            error={!!errors.email}
            disabled={isLoading}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          
          <TextInput
            label={t('profile.phone')}
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            style={[styles.input, styles.fullWidthInput]}
            keyboardType="phone-pad"
            error={!!errors.phone}
            disabled={isLoading}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}
          
          <TextInput
            label={t('profile.dateOfBirth')}
            value={formData.dateOfBirth}
            onChangeText={(text) => handleChange('dateOfBirth', text)}
            style={[styles.input, styles.fullWidthInput]}
            disabled={isLoading}
            placeholder="YYYY-MM-DD"
          />
        </Surface>
        
        <Surface style={styles.formContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('profile.address')}</Text>
          
          <TextInput
            label={t('profile.street')}
            value={formData.street}
            onChangeText={(text) => handleChange('street', text)}
            style={[styles.input, styles.fullWidthInput]}
            disabled={isLoading}
          />
          
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <TextInput
                label={t('profile.city')}
                value={formData.city}
                onChangeText={(text) => handleChange('city', text)}
                style={styles.input}
                disabled={isLoading}
              />
            </View>
            
            <View style={styles.formField}>
              <TextInput
                label={t('profile.state')}
                value={formData.state}
                onChangeText={(text) => handleChange('state', text)}
                style={styles.input}
                disabled={isLoading}
              />
            </View>
          </View>
          
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <TextInput
                label={t('profile.postalCode')}
                value={formData.postalCode}
                onChangeText={(text) => handleChange('postalCode', text)}
                style={styles.input}
                disabled={isLoading}
              />
            </View>
            
            <View style={styles.formField}>
              <TextInput
                label={t('profile.country')}
                value={formData.country}
                onChangeText={(text) => handleChange('country', text)}
                style={styles.input}
                disabled={isLoading}
              />
            </View>
          </View>
        </Surface>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            loading={isLoading}
            disabled={isLoading}
          >
            {t('common.save')}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    margin: 16,
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
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  formField: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  fullWidthInput: {
    width: '100%',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#1976D2',
  },
});

export default EditProfileScreen;
