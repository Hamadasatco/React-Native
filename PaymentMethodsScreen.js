import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, Divider, List, IconButton, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const PaymentMethodsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Get payment methods from route params
  const { paymentMethods } = route.params || {
    paymentMethods: [
      {
        id: 'pm1',
        type: 'credit',
        cardNumber: '****4567',
        cardHolder: 'John Doe',
        expiryDate: '12/25',
        isDefault: true
      }
    ]
  };
  
  // State for payment methods
  const [methods, setMethods] = useState(paymentMethods || []);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle set default payment method
  const handleSetDefault = (id) => {
    const updatedMethods = methods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setMethods(updatedMethods);
  };
  
  // Handle remove payment method
  const handleRemove = (id) => {
    const updatedMethods = methods.filter(method => method.id !== id);
    setMethods(updatedMethods);
  };
  
  // Handle add new payment method
  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod');
  };
  
  // Get card icon based on type
  const getCardIcon = (type) => {
    switch (type) {
      case 'credit':
        return 'credit-card';
      case 'debit':
        return 'credit-card-outline';
      case 'paypal':
        return 'paypal';
      default:
        return 'credit-card-settings';
    }
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('payment.savedMethods')}</Text>
        <Text style={[styles.sectionDescription, rtlStyles]}>
          {t('payment.savedMethodsDescription')}
        </Text>
        
        {methods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconButton icon="credit-card-off" size={48} color="#9E9E9E" />
            <Text style={styles.emptyText}>{t('payment.noSavedMethods')}</Text>
          </View>
        ) : (
          methods.map((method) => (
            <Card key={method.id} style={styles.cardContainer}>
              <Card.Content>
                <View style={[styles.cardHeader, rtlStyles]}>
                  <View style={styles.cardTypeContainer}>
                    <IconButton 
                      icon={getCardIcon(method.type)} 
                      size={24} 
                      color="#1976D2" 
                    />
                    <Text style={styles.cardType}>
                      {t(`payment.${method.type}`)}
                    </Text>
                  </View>
                  
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>{t('payment.default')}</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.cardNumber}>{method.cardNumber}</Text>
                <Text style={styles.cardHolder}>{method.cardHolder}</Text>
                
                <View style={[styles.cardFooter, rtlStyles]}>
                  <Text style={styles.expiryDate}>
                    {t('payment.expires')}: {method.expiryDate}
                  </Text>
                  
                  <View style={styles.cardActions}>
                    {!method.isDefault && (
                      <Button
                        mode="text"
                        onPress={() => handleSetDefault(method.id)}
                        style={styles.actionButton}
                      >
                        {t('payment.setDefault')}
                      </Button>
                    )}
                    
                    <Button
                      mode="text"
                      onPress={() => handleRemove(method.id)}
                      style={[styles.actionButton, styles.removeButton]}
                    >
                      {t('payment.remove')}
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
        
        <Button
          mode="contained"
          icon="plus"
          onPress={handleAddPaymentMethod}
          style={styles.addButton}
        >
          {t('payment.addPaymentMethod')}
        </Button>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('payment.securityInfo')}</Text>
        <Text style={[styles.securityText, rtlStyles]}>
          {t('payment.securityDescription')}
        </Text>
        
        <View style={[styles.securityPoint, rtlStyles]}>
          <IconButton icon="shield-lock" size={24} color="#1976D2" />
          <Text style={styles.securityPointText}>
            {t('payment.securityPoint1')}
          </Text>
        </View>
        
        <View style={[styles.securityPoint, rtlStyles]}>
          <IconButton icon="eye-off" size={24} color="#1976D2" />
          <Text style={styles.securityPointText}>
            {t('payment.securityPoint2')}
          </Text>
        </View>
        
        <View style={[styles.securityPoint, rtlStyles]}>
          <IconButton icon="lock" size={24} color="#1976D2" />
          <Text style={styles.securityPointText}>
            {t('payment.securityPoint3')}
          </Text>
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
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 8,
    color: '#9E9E9E',
  },
  cardContainer: {
    marginBottom: 16,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  defaultBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardHolder: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryDate: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  removeButton: {
    color: '#F44336',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#1976D2',
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  securityPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityPointText: {
    flex: 1,
  },
  backButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
  },
});

export default PaymentMethodsScreen;
