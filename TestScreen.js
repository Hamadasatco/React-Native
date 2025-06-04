import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

const TestScreen = () => {
  const testAuthFlow = () => {
    console.log('Testing authentication flow');
    // Test code for authentication flow
  };

  const testSearchFlow = () => {
    console.log('Testing search and booking flow');
    // Test code for search and booking flow
  };

  const testTicketManagement = () => {
    console.log('Testing ticket management');
    // Test code for ticket management
  };

  const testErrorHandling = () => {
    console.log('Testing error handling');
    // Test code for error scenarios
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Tickets App - Test Suite</Text>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Authentication Tests</Text>
        <Button mode="contained" style={styles.testButton} onPress={testAuthFlow}>
          Test Login Flow
        </Button>
        <Button mode="contained" style={styles.testButton} onPress={testAuthFlow}>
          Test Registration Flow
        </Button>
        <Button mode="contained" style={styles.testButton} onPress={testAuthFlow}>
          Test Password Reset
        </Button>
      </View>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Search & Booking Tests</Text>
        <Button mode="contained" style={styles.testButton} onPress={testSearchFlow}>
          Test Search Functionality
        </Button>
        <Button mode="contained" style={styles.testButton} onPress={testSearchFlow}>
          Test Seat Selection
        </Button>
        <Button mode="contained" style={styles.testButton} onPress={testSearchFlow}>
          Test Payment Process
        </Button>
      </View>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Ticket Management Tests</Text>
        <Button mode="contained" style={styles.testButton} onPress={testTicketManagement}>
          Test Ticket Viewing
        </Button>
        <Button mode="contained" style={styles.testButton} onPress={testTicketManagement}>
          Test Ticket Filtering
        </Button>
      </View>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Error Handling Tests</Text>
        <Button mode="contained" style={styles.testButton} onPress={testErrorHandling}>
          Test Network Error
        </Button>
        <Button mode="contained" style={styles.testButton} onPress={testErrorHandling}>
          Test Invalid Input
        </Button>
        <Button mode="contained" style={styles.testButton} onPress={testErrorHandling}>
          Test Payment Failure
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  testSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  testButton: {
    marginBottom: 8,
    backgroundColor: '#1976D2',
  },
});

export default TestScreen;
