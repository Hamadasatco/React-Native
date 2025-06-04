import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { IconButton } from 'react-native-paper';

// Import screens
// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main screens
import HomeScreen from '../screens/home/HomeScreen';
import BusListScreen from '../screens/home/BusListScreen';
import BusDetailsScreen from '../screens/home/BusDetailsScreen';
import SeatSelectionScreen from '../screens/booking/SeatSelectionScreen';
import PassengerInfoScreen from '../screens/booking/PassengerInfoScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';
import UpcomingTicketsScreen from '../screens/tickets/UpcomingTicketsScreen';
import TicketDetailsScreen from '../screens/tickets/TicketDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

// New tracking screen
import BusTrackingScreen from '../screens/tracking/BusTrackingScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: t('auth.login') }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: t('auth.register') }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ title: t('auth.forgotPassword') }}
      />
    </Stack.Navigator>
  );
};

// Home Stack
const HomeStack = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: t('common.appName'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
      <Stack.Screen 
        name="BusList" 
        component={BusListScreen} 
        options={{ 
          title: t('busList.availableBuses'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
      <Stack.Screen 
        name="BusDetails" 
        component={BusDetailsScreen} 
        options={{ 
          title: t('busDetails.busDetails'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
      <Stack.Screen 
        name="BusTracking" 
        component={BusTrackingScreen} 
        options={{ 
          title: t('tracking.trackYourBus'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
    </Stack.Navigator>
  );
};

// Tickets Stack
const TicketsStack = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UpcomingTickets" 
        component={UpcomingTicketsScreen} 
        options={{ 
          title: t('tickets.myTickets'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
      <Stack.Screen 
        name="TicketDetails" 
        component={TicketDetailsScreen} 
        options={{ 
          title: t('tickets.ticketDetails'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
      <Stack.Screen 
        name="BusTracking" 
        component={BusTrackingScreen} 
        options={{ 
          title: t('tracking.trackYourBus'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: t('profile.myProfile'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: t('profile.settings'),
          headerTitleAlign: isRTL ? 'right' : 'left'
        }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: isRTL ? 'beside-icon' : 'below-icon',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ 
          title: t('common.home'),
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="home" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="TicketsTab" 
        component={TicketsStack} 
        options={{ 
          title: t('tickets.myTickets'),
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="ticket" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack} 
        options={{ 
          title: t('profile.profile'),
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="account" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

// Modal Stack (screens that appear as modals over the main tabs)
const ModalStack = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerTitleAlign: isRTL ? 'right' : 'left'
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SeatSelection" 
        component={SeatSelectionScreen} 
        options={{ title: t('seatSelection.selectYourSeats') }}
      />
      <Stack.Screen 
        name="PassengerInfo" 
        component={PassengerInfoScreen} 
        options={{ title: t('passengerInfo.passengerInformation') }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: t('payment.payment') }}
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmationScreen} 
        options={{ title: t('bookingConfirmation.bookingConfirmed') }}
      />
    </Stack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  // This would typically be controlled by authentication state
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      {isAuthenticated ? <ModalStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
