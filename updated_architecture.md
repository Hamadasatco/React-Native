# Bus Tickets App - Updated Architecture

## Overview
This document outlines the updated architecture for the Bus Tickets App, incorporating the new profile and trips history pages. The architecture maintains the existing modular structure while adding new components and integration points for the new features.

## System Architecture

### Updated Component Structure
```
BusTicketsApp/
├── src/
│   ├── assets/                # Images, fonts, and other static assets
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Generic components
│   │   ├── auth/              # Authentication related components
│   │   ├── booking/           # Booking related components
│   │   ├── payment/           # Payment related components
│   │   ├── tracking/          # Enhanced tracking components
│   │   ├── notifications/     # Notification related components
│   │   ├── offline/           # Offline mode components
│   │   ├── sharing/           # Location sharing components
│   │   ├── chat/              # Chat interface components
│   │   ├── profile/           # NEW: Profile related components
│   │   └── trips/             # NEW: Trips history components
│   ├── contexts/              # React contexts
│   │   ├── LanguageContext.js # Language and RTL support
│   │   ├── TrackingContext.js # Tracking state management
│   │   ├── OfflineContext.js  # Offline state management
│   │   ├── ChatContext.js     # Chat state management
│   │   └── ProfileContext.js  # NEW: Profile state management
│   ├── i18n/                  # Internationalization
│   │   ├── locales/           # Translation files
│   │   └── index.js           # i18n configuration
│   ├── navigation/            # Navigation configuration
│   ├── screens/               # Screen components
│   │   ├── auth/              # Authentication screens
│   │   ├── home/              # Home and search screens
│   │   ├── booking/           # Booking flow screens
│   │   ├── payment/           # Payment screens
│   │   ├── tracking/          # Enhanced tracking screens
│   │   ├── offline/           # Offline mode screens
│   │   ├── sharing/           # Location sharing screens
│   │   ├── chat/              # Chat screens
│   │   ├── profile/           # NEW: Profile screens
│   │   └── trips/             # NEW: Trips history screens
│   ├── services/              # API services and external integrations
│   │   ├── api/               # Base API service
│   │   ├── auth/              # Authentication services
│   │   ├── payment/           # Payment services
│   │   ├── tracking/          # Enhanced tracking services
│   │   ├── traffic/           # Traffic information services
│   │   ├── notification/      # Push notification services
│   │   ├── offline/           # Offline data management
│   │   ├── sharing/           # Location sharing services
│   │   ├── chat/              # Chat services
│   │   ├── profile/           # NEW: Profile services
│   │   └── trips/             # NEW: Trips history services
│   ├── store/                 # Redux store
│   │   ├── slices/            # Redux slices
│   │   │   ├── profileSlice.js # NEW: Profile state slice
│   │   │   └── tripsSlice.js   # NEW: Trips history state slice
│   │   ├── actions/           # Redux actions
│   │   └── selectors/         # Redux selectors
│   ├── utils/                 # Utility functions
│   ├── hooks/                 # Custom React hooks
│   │   ├── useProfile.js      # NEW: Profile data hook
│   │   └── useTrips.js        # NEW: Trips history hook
│   ├── constants/             # App constants
│   └── theme/                 # Theme configuration
├── App.js                     # Root component
└── index.js                   # Entry point
```

## New Components and Services

### Profile Components
1. **ProfileHeader**: Displays user image, name, and basic info
2. **ProfileForm**: Form for editing profile information
3. **ProfileImagePicker**: Component for selecting and cropping profile images
4. **PreferenceToggle**: Reusable toggle component for user preferences
5. **PaymentMethodCard**: Display and management of payment methods
6. **SecuritySettings**: Password change and security options
7. **NotificationPreferences**: Profile-specific notification settings

### Trips History Components
1. **TripsList**: Main component for displaying trip history
2. **TripCard**: Card component for individual trip summary
3. **TripFilters**: Filtering options for trips
4. **TripSearchBar**: Search functionality for trips
5. **TripDetails**: Detailed view of a single trip
6. **TripMap**: Map visualization of trip route
7. **TripActions**: Action buttons for trip operations
8. **TripStatistics**: Visual representation of travel statistics

### Profile Screens
1. **ProfileScreen**: Main profile view with user information
2. **EditProfileScreen**: Form for editing profile details
3. **PreferencesScreen**: User preferences management
4. **PaymentMethodsScreen**: Payment methods management
5. **SecurityScreen**: Security settings and password change
6. **HelpSupportScreen**: Access to help and support

### Trips History Screens
1. **TripsHistoryScreen**: Main trips listing with filters
2. **TripDetailScreen**: Detailed view of a single trip
3. **TripTicketScreen**: Ticket/boarding pass view
4. **TripStatisticsScreen**: Travel statistics and visualizations
5. **TripRatingScreen**: Rating and review interface for completed trips

### Services
1. **ProfileService**: API integration for profile operations
   - `getProfile()`: Fetch user profile data
   - `updateProfile(data)`: Update profile information
   - `uploadProfileImage(image)`: Upload profile picture
   - `updatePreferences(prefs)`: Update user preferences
   - `changePassword(oldPw, newPw)`: Change user password
   - `getPaymentMethods()`: Get saved payment methods
   - `addPaymentMethod(data)`: Add new payment method
   - `removePaymentMethod(id)`: Remove payment method

2. **TripsService**: API integration for trips history
   - `getTrips(filters)`: Get trips with optional filters
   - `getTripDetails(id)`: Get detailed information for a trip
   - `searchTrips(query)`: Search trips by criteria
   - `cancelTrip(id)`: Cancel an upcoming trip
   - `modifyTrip(id, data)`: Modify trip details
   - `downloadTicket(id)`: Download ticket/boarding pass
   - `rateTrip(id, rating, review)`: Submit rating for a trip
   - `getTripStatistics(dateRange)`: Get travel statistics

## State Management

### Redux Slices
1. **profileSlice**: Manages profile state
   - User information
   - Preferences
   - Payment methods
   - Loading states
   - Error states

2. **tripsSlice**: Manages trips history state
   - Trip list
   - Filters
   - Search results
   - Selected trip
   - Loading states
   - Error states

### Context API
1. **ProfileContext**: Provides profile data and operations to components
   - Current profile data
   - Profile update functions
   - Profile image handling
   - Preferences management

## Navigation Updates

### Tab Navigation
- Add Profile tab to main bottom tab navigator
- Add Trips History tab to main bottom tab navigator

### Stack Navigation
1. **ProfileStack**:
   - ProfileScreen (main)
   - EditProfileScreen
   - PreferencesScreen
   - PaymentMethodsScreen
   - SecurityScreen
   - HelpSupportScreen

2. **TripsStack**:
   - TripsHistoryScreen (main)
   - TripDetailScreen
   - TripTicketScreen
   - TripStatisticsScreen
   - TripRatingScreen

## Integration Points

### Authentication Integration
- Profile data retrieval after login
- Token refresh handling
- Session management
- Logout functionality

### Notification Integration
- Profile-specific notification preferences
- Trip status notification settings
- Push notification token management

### Localization Integration
- Profile and trips screens translation
- RTL layout support
- Date, time, and currency formatting
- Language preference in profile settings

### Offline Support Integration
- Profile data caching
- Trips history caching
- Offline editing queue
- Synchronization on reconnection

### Payment Integration
- Payment methods management
- Secure card information storage
- Default payment method selection

## Data Models

### Profile Model
```typescript
interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  preferences: {
    language: 'en' | 'ar';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    travelPreferences: {
      seatType?: 'window' | 'aisle' | 'any';
      specialRequirements?: string[];
    };
  };
  paymentMethods: PaymentMethod[];
  createdAt: string;
  lastLogin: string;
}
```

### Payment Method Model
```typescript
interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal' | 'other';
  cardNumber?: string; // Last 4 digits only
  cardHolder?: string;
  expiryDate?: string;
  isDefault: boolean;
}
```

### Trip Model
```typescript
interface Trip {
  id: string;
  bookingId: string;
  status: 'upcoming' | 'completed' | 'canceled';
  route: {
    origin: {
      name: string;
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    destination: {
      name: string;
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    stops?: {
      name: string;
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
      arrivalTime: string;
      departureTime: string;
    }[];
  };
  schedule: {
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
    duration: string;
  };
  bus: {
    id: string;
    operator: string;
    busNumber: string;
    busType: string;
  };
  seat: {
    number: string;
    type: string;
  };
  passenger: {
    name: string;
    email: string;
    phone: string;
  };
  payment: {
    amount: number;
    currency: string;
    method: string;
    transactionId: string;
    status: string;
  };
  rating?: {
    score: number;
    review?: string;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Profile Endpoints
- `GET /api/profile`: Get user profile
- `PUT /api/profile`: Update user profile
- `POST /api/profile/image`: Upload profile image
- `PUT /api/profile/preferences`: Update preferences
- `PUT /api/profile/password`: Change password
- `GET /api/profile/payment-methods`: Get payment methods
- `POST /api/profile/payment-methods`: Add payment method
- `DELETE /api/profile/payment-methods/:id`: Remove payment method

### Trips Endpoints
- `GET /api/trips`: Get trips history with filters
- `GET /api/trips/:id`: Get trip details
- `GET /api/trips/search`: Search trips
- `POST /api/trips/:id/cancel`: Cancel trip
- `PUT /api/trips/:id`: Modify trip
- `GET /api/trips/:id/ticket`: Download ticket
- `POST /api/trips/:id/rating`: Rate trip
- `GET /api/trips/statistics`: Get trip statistics

## Security Considerations

### Profile Security
- Secure storage of personal information
- Encryption for sensitive data
- Proper authentication for profile changes
- Input validation and sanitization
- HTTPS for all API calls
- Token-based authentication

### Payment Security
- PCI compliance for payment information
- Tokenization of payment methods
- Masking of card numbers
- Secure storage of payment tokens

## Performance Considerations

### Data Loading Strategies
- Progressive loading of profile sections
- Pagination for trips history
- Caching frequently accessed data
- Background loading of non-critical data

### Image Optimization
- Profile image resizing and compression
- Lazy loading of images
- Image caching

## Offline Support

### Profile Offline Support
- Cache profile data for offline viewing
- Queue profile updates for when connection is restored
- Conflict resolution for offline edits

### Trips Offline Support
- Cache recent trips for offline viewing
- Offline ticket access
- Background synchronization

## Accessibility Considerations

### Profile Accessibility
- Proper labeling for form fields
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

### Trips Accessibility
- Alternative text for trip visualizations
- Keyboard accessible filters and actions
- Screen reader announcements for status changes

## Localization Support

### Profile Localization
- Translated form labels and placeholders
- RTL layout support for Arabic
- Localized date and time formats
- Culturally appropriate input formats

### Trips Localization
- Translated trip statuses and details
- RTL layout for trip cards and details
- Localized date, time, and currency formats
- Direction-aware trip maps

## Testing Strategy

### Unit Testing
- Profile form validation
- Trip filtering and sorting logic
- Payment method management
- Preference handling

### Integration Testing
- API interactions for profile and trips
- Navigation between screens
- State management integration

### UI Testing
- Profile editing flows
- Trip detail viewing
- Responsive layout testing
- RTL layout testing

### Localization Testing
- Text display in both languages
- RTL layout correctness
- Date and currency formatting

## Implementation Plan

### Phase 1: Core Profile Implementation
- Basic profile view and edit functionality
- Profile image management
- Preferences management

### Phase 2: Core Trips History Implementation
- Basic trips listing with filters
- Trip details view
- Ticket display

### Phase 3: Advanced Features
- Payment methods management
- Trip statistics and visualizations
- Trip actions (cancel, modify, rate)

### Phase 4: Integration and Polish
- Full localization support
- Offline functionality
- Performance optimization
- Accessibility improvements

## Conclusion
This updated architecture provides a comprehensive framework for implementing the profile and trips history pages while maintaining consistency with the existing app structure. The modular approach ensures that these new features can be seamlessly integrated with the current functionality while supporting future enhancements.
