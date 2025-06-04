import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Divider } from 'react-native-paper';

const TestResultsScreen = () => {
  // Mock test results
  const testResults = {
    authentication: {
      login: { status: 'PASS', notes: 'Successfully logs in with valid credentials' },
      registration: { status: 'PASS', notes: 'Successfully creates new account' },
      passwordReset: { status: 'PASS', notes: 'Successfully sends reset link' },
    },
    search: {
      searchFunctionality: { status: 'PASS', notes: 'Search returns correct results' },
      filtering: { status: 'PASS', notes: 'Filters work as expected' },
      sorting: { status: 'PASS', notes: 'Sorting options function correctly' },
    },
    booking: {
      seatSelection: { status: 'PASS', notes: 'Seat selection interface works correctly' },
      passengerInfo: { status: 'PASS', notes: 'Form validation works as expected' },
      payment: { status: 'PASS', notes: 'Payment process completes successfully' },
    },
    ticketManagement: {
      viewTicket: { status: 'PASS', notes: 'Ticket details display correctly' },
      upcomingTickets: { status: 'PASS', notes: 'Lists all upcoming tickets' },
      pastTickets: { status: 'PASS', notes: 'Shows past journey history' },
    },
    errorHandling: {
      networkError: { status: 'PASS', notes: 'Shows appropriate error message' },
      invalidInput: { status: 'PASS', notes: 'Form validation prevents submission' },
      paymentFailure: { status: 'PASS', notes: 'Handles payment failures gracefully' },
    },
    performance: {
      loadTime: { status: 'PASS', notes: 'App loads within acceptable time' },
      navigation: { status: 'PASS', notes: 'Navigation between screens is smooth' },
      responsiveness: { status: 'PASS', notes: 'UI responds quickly to user input' },
    },
  };

  const renderTestCategory = (category, title) => (
    <Card style={styles.categoryCard}>
      <Card.Title title={title} />
      <Card.Content>
        {Object.entries(category).map(([testName, result], index) => (
          <View key={testName}>
            <List.Item
              title={testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              description={result.notes}
              left={props => (
                <List.Icon
                  {...props}
                  icon={result.status === 'PASS' ? 'check-circle' : 'alert-circle'}
                  color={result.status === 'PASS' ? '#4CAF50' : '#F44336'}
                />
              )}
              right={props => (
                <Text
                  {...props}
                  style={[
                    styles.statusText,
                    result.status === 'PASS' ? styles.passText : styles.failText,
                  ]}
                >
                  {result.status}
                </Text>
              )}
            />
            {index < Object.entries(category).length - 1 && <Divider />}
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test Results</Text>
      
      {renderTestCategory(testResults.authentication, 'Authentication Tests')}
      {renderTestCategory(testResults.search, 'Search Tests')}
      {renderTestCategory(testResults.booking, 'Booking Tests')}
      {renderTestCategory(testResults.ticketManagement, 'Ticket Management Tests')}
      {renderTestCategory(testResults.errorHandling, 'Error Handling Tests')}
      {renderTestCategory(testResults.performance, 'Performance Tests')}
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Test Summary</Text>
        <Text style={styles.summaryText}>
          All tests have passed successfully. The app is functioning as expected across all core features.
        </Text>
        <Button mode="contained" style={styles.button}>
          Generate Full Report
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statusText: {
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  passText: {
    color: '#4CAF50',
  },
  failText: {
    color: '#F44336',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1976D2',
  },
});

export default TestResultsScreen;
