import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, Divider, List, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const TripStatisticsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // State for statistics
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year'); // 'month', 'year', 'all'
  
  // Mock statistics data - in a real app, this would come from an API call
  const mockStatistics = {
    totalTrips: 24,
    totalDistance: 4328,
    totalSpent: 1245.75,
    mostFrequentRoute: {
      origin: 'New York',
      destination: 'Boston',
      count: 8
    },
    averageRating: 4.2,
    monthlyTrips: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [2, 3, 1, 5, 4, 2]
    },
    tripsByOperator: [
      { operator: 'Express Lines', count: 10 },
      { operator: 'Midwest Transit', count: 8 },
      { operator: 'Pacific Coast Lines', count: 6 }
    ],
    tripsByStatus: {
      completed: 18,
      upcoming: 4,
      canceled: 2
    }
  };
  
  // Load statistics on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStatistics(mockStatistics);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setIsLoading(true);
    
    // Simulate API call for different time ranges
    setTimeout(() => {
      // In a real app, we would fetch different data based on the time range
      setIsLoading(false);
    }, 500);
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>{t('statistics.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerContainer}>
        <Text style={[styles.headerTitle, rtlStyles]}>{t('statistics.travelStatistics')}</Text>
        
        <View style={styles.timeRangeContainer}>
          <Button
            mode={timeRange === 'month' ? 'contained' : 'outlined'}
            onPress={() => handleTimeRangeChange('month')}
            style={styles.timeRangeButton}
            compact
          >
            {t('statistics.month')}
          </Button>
          
          <Button
            mode={timeRange === 'year' ? 'contained' : 'outlined'}
            onPress={() => handleTimeRangeChange('year')}
            style={styles.timeRangeButton}
            compact
          >
            {t('statistics.year')}
          </Button>
          
          <Button
            mode={timeRange === 'all' ? 'contained' : 'outlined'}
            onPress={() => handleTimeRangeChange('all')}
            style={styles.timeRangeButton}
            compact
          >
            {t('statistics.allTime')}
          </Button>
        </View>
      </Surface>
      
      <Surface style={styles.summaryContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('statistics.summary')}</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.totalTrips}</Text>
            <Text style={styles.statLabel}>{t('statistics.totalTrips')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.totalDistance}</Text>
            <Text style={styles.statLabel}>{t('statistics.totalDistance')} km</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${statistics.totalSpent}</Text>
            <Text style={styles.statLabel}>{t('statistics.totalSpent')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.averageRating}</Text>
            <Text style={styles.statLabel}>{t('statistics.avgRating')}</Text>
          </View>
        </View>
      </Surface>
      
      <Surface style={styles.chartContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('statistics.monthlyTrips')}</Text>
        
        <LineChart
          data={{
            labels: statistics.monthlyTrips.labels,
            datasets: [
              {
                data: statistics.monthlyTrips.data
              }
            ]
          }}
          width={Dimensions.get('window').width - 64}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#1976D2'
            }
          }}
          bezier
          style={styles.chart}
        />
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('statistics.mostFrequentRoute')}</Text>
        
        <View style={styles.routeCard}>
          <View style={styles.routeIcons}>
            <IconButton icon="map-marker" size={24} color="#1976D2" />
            <View style={styles.routeLine} />
            <IconButton icon="map-marker-check" size={24} color="#2E7D32" />
          </View>
          
          <View style={styles.routeDetails}>
            <Text style={styles.routeOrigin}>{statistics.mostFrequentRoute.origin}</Text>
            <Text style={styles.routeDestination}>{statistics.mostFrequentRoute.destination}</Text>
            <Text style={styles.routeCount}>
              {t('statistics.traveled')} {statistics.mostFrequentRoute.count} {t('statistics.times')}
            </Text>
          </View>
        </View>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('statistics.tripsByOperator')}</Text>
        
        {statistics.tripsByOperator.map((item, index) => (
          <View key={index} style={[styles.operatorRow, rtlStyles]}>
            <Text style={styles.operatorName}>{item.operator}</Text>
            <View style={styles.operatorBarContainer}>
              <View 
                style={[
                  styles.operatorBar, 
                  { 
                    width: `${(item.count / statistics.totalTrips) * 100}%`,
                    backgroundColor: index === 0 ? '#1976D2' : index === 1 ? '#2196F3' : '#64B5F6'
                  }
                ]} 
              />
            </View>
            <Text style={styles.operatorCount}>{item.count}</Text>
          </View>
        ))}
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('statistics.tripsByStatus')}</Text>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <View style={[styles.statusCircle, { backgroundColor: '#2E7D32' }]}>
              <Text style={styles.statusValue}>{statistics.tripsByStatus.completed}</Text>
            </View>
            <Text style={styles.statusLabel}>{t('statistics.completed')}</Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusCircle, { backgroundColor: '#1976D2' }]}>
              <Text style={styles.statusValue}>{statistics.tripsByStatus.upcoming}</Text>
            </View>
            <Text style={styles.statusLabel}>{t('statistics.upcoming')}</Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusCircle, { backgroundColor: '#D32F2F' }]}>
              <Text style={styles.statusValue}>{statistics.tripsByStatus.canceled}</Text>
            </View>
            <Text style={styles.statusLabel}>{t('statistics.canceled')}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  headerContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeRangeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryContainer: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
  },
  routeIcons: {
    alignItems: 'center',
    marginRight: 16,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#1976D2',
  },
  routeDetails: {
    flex: 1,
  },
  routeOrigin: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeDestination: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  routeCount: {
    fontSize: 14,
    color: '#1976D2',
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  operatorName: {
    width: '30%',
    fontSize: 14,
  },
  operatorBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  operatorBar: {
    height: '100%',
    borderRadius: 8,
  },
  operatorCount: {
    width: '10%',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
  },
});

export default TripStatisticsScreen;
