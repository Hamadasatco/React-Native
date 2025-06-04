import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ForgotPasswordScreen = ({ navigation }) => {
  const forgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values) => {
      // This would typically call a password reset service
      console.log('Password reset requested for:', values.email);
      // For demo purposes, we'll just show a success message
      // and navigate back to login
      setTimeout(() => {
        alert('Password reset link sent to your email');
        navigation.navigate('Login');
      }, 1500);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo-placeholder.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Bus Tickets App</Text>
      </View>

      <Surface style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password
        </Text>

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

        <Button
          mode="contained"
          onPress={formik.handleSubmit}
          style={styles.button}
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
        >
          Send Reset Link
        </Button>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backToLoginContainer}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1976D2',
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 8,
    backgroundColor: '#1976D2',
  },
  backToLoginContainer: {
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
