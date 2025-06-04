import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, TextInput, Button, Divider } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PassengerInfoScreen = ({ route, navigation }) => {
  const { bus, selectedSeats, totalPrice } = route.params || {
    bus: {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
    },
    selectedSeats: ['5A', '5B'],
    totalPrice: '119.98'
  };

  const passengerValidationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      specialRequests: '',
    },
    validationSchema: passengerValidationSchema,
    onSubmit: (values) => {
      // This would typically call a booking service
      console.log('Passenger info submitted:', values);
      navigation.navigate('Payment', {
        bus,
        selectedSeats,
        totalPrice,
        passengerInfo: values,
      });
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Passenger Information</Text>
          <Text style={styles.headerSubtitle}>
            {bus.operator} - {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
          </Text>
        </Surface>

        <Surface style={styles.formContainer}>
          <TextInput
            label="Full Name"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          {formik.touched.name && formik.errors.name && (
            <Text style={styles.errorText}>{formik.errors.name}</Text>
          )}

          <TextInput
            label="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.errorText}>{formik.errors.email}</Text>
          )}

          <TextInput
            label="Phone Number"
            value={formik.values.phone}
            onChangeText={formik.handleChange('phone')}
            onBlur={formik.handleBlur('phone')}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            style={styles.input}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
          />
          {formik.touched.phone && formik.errors.phone && (
            <Text style={styles.errorText}>{formik.errors.phone}</Text>
          )}

          <TextInput
            label="Address"
            value={formik.values.address}
            onChangeText={formik.handleChange('address')}
            onBlur={formik.handleBlur('address')}
            error={formik.touched.address && Boolean(formik.errors.address)}
            style={styles.input}
            left={<TextInput.Icon icon="home" />}
          />
          {formik.touched.address && formik.errors.address && (
            <Text style={styles.errorText}>{formik.errors.address}</Text>
          )}

          <TextInput
            label="Special Requests (Optional)"
            value={formik.values.specialRequests}
            onChangeText={formik.handleChange('specialRequests')}
            style={styles.input}
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="note" />}
          />
        </Surface>

        <Surface style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Operator:</Text>
            <Text style={styles.summaryValue}>{bus.operator}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Departure:</Text>
            <Text style={styles.summaryValue}>{bus.departure}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Arrival:</Text>
            <Text style={styles.summaryValue}>{bus.arrival}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Seats:</Text>
            <Text style={styles.summaryValue}>{selectedSeats.join(', ')}</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>
        </Surface>
      </ScrollView>

      <Surface style={styles.bottomContainer}>
        <Button
          mode="contained"
          style={styles.continueButton}
          onPress={formik.handleSubmit}
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
        >
          Proceed to Payment
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
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  summaryContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 80, // Extra space for bottom button
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  divider: {
    marginVertical: 12,
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
  continueButton: {
    backgroundColor: '#1976D2',
  },
});

export default PassengerInfoScreen;
