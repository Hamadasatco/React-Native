import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

// Placeholder images for the app
// These would be replaced with actual images in a production app
const LogoPlaceholder = () => (
  <View style={styles.logoPlaceholder}>
    <Text style={styles.logoText}>BT</Text>
  </View>
);

const BusPlaceholder = () => (
  <View style={styles.busPlaceholder}>
    <Text style={styles.placeholderText}>Bus Image</Text>
  </View>
);

const PaymentIconPlaceholder = (type) => (
  <View style={styles.paymentIconPlaceholder}>
    <Text style={styles.placeholderText}>{type}</Text>
  </View>
);

const styles = StyleSheet.create({
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  busPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  paymentIconPlaceholder: {
    width: 50,
    height: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  placeholderText: {
    color: '#757575',
    fontSize: 14,
  },
});

export { LogoPlaceholder, BusPlaceholder, PaymentIconPlaceholder };
