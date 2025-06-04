import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, Button, RadioButton, Divider, TextInput } from 'react-native-paper';

const PaymentScreen = ({ route, navigation }) => {
  const { bus, selectedSeats, totalPrice, passengerInfo } = route.params || {
    bus: {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
    },
    selectedSeats: ['5A', '5B'],
    totalPrice: '119.98',
    passengerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    }
  };

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate a random booking ID
      const bookingId = 'BK' + Math.floor(100000 + Math.random() * 900000);
      
      navigation.navigate('BookingConfirmation', {
        bus,
        selectedSeats,
        totalPrice,
        passengerInfo,
        bookingId,
        paymentMethod,
      });
    }, 2000);
  };

  const formatCardNumber = (text) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleaned.length > 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    
    return cleaned;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSubtitle}>
            Total Amount: ${totalPrice}
          </Text>
        </Surface>

        <Surface style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
            <View style={styles.paymentOption}>
              <View style={styles.paymentOptionLeft}>
                <RadioButton value="creditCard" />
                <Image
                  source={require('../../assets/credit-card-placeholder.png')}
                  style={styles.paymentIcon}
                />
                <Text>Credit/Debit Card</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.paymentOption}>
              <View style={styles.paymentOptionLeft}>
                <RadioButton value="paypal" />
                <Image
                  source={require('../../assets/paypal-placeholder.png')}
                  style={styles.paymentIcon}
                />
                <Text>PayPal</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.paymentOption}>
              <View style={styles.paymentOptionLeft}>
                <RadioButton value="googlePay" />
                <Image
                  source={require('../../assets/google-pay-placeholder.png')}
                  style={styles.paymentIcon}
                />
                <Text>Google Pay</Text>
              </View>
            </View>
          </RadioButton.Group>
        </Surface>

        {paymentMethod === 'creditCard' && (
          <Surface style={styles.cardDetailsContainer}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <TextInput
              label="Card Number"
              value={cardNumber}
              onChangeText={text => setCardNumber(formatCardNumber(text))}
              style={styles.input}
              keyboardType="numeric"
              maxLength={19}
              left={<TextInput.Icon icon="credit-card" />}
            />
            
            <TextInput
              label="Cardholder Name"
              value={cardName}
              onChangeText={setCardName}
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
            
            <View style={styles.rowInputs}>
              <TextInput
                label="Expiry Date"
                value={expiryDate}
                onChangeText={text => setExpiryDate(formatExpiryDate(text))}
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                maxLength={5}
                placeholder="MM/YY"
                left={<TextInput.Icon icon="calendar" />}
              />
              
              <TextInput
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
              />
            </View>
          </Surface>
        )}

        <Surface style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ticket Price:</Text>
            <Text style={styles.summaryValue}>${totalPrice}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Booking Fee:</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>
        </Surface>
      </ScrollView>

      <Surface style={styles.bottomContainer}>
        <Button
          mode="contained"
          style={styles.payButton}
          onPress={handlePayment}
          loading={isProcessing}
          disabled={isProcessing || (paymentMethod === 'creditCard' && (!cardNumber || !cardName || !expiryDate || !cvv))}
        >
          {isProcessing ? 'Processing...' : `Pay $${totalPrice}`}
        </Button>
      </Surface>
    </View>
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
  headerContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentMethodsContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
    resizeMode: 'contain',
  },
  divider: {
    marginVertical: 8,
  },
  cardDetailsContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  summaryContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 80, // Extra space for bottom button
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  payButton: {
    backgroundColor: '#1976D2',
  },
});

export default PaymentScreen;
