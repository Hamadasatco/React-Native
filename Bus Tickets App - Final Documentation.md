# Bus Tickets App - Final Documentation

## Overview
The Bus Tickets App is a mobile application built with React Native that allows users to browse bus routes, select seats, and purchase tickets. The app provides a seamless and user-friendly experience for bus travelers, with support for both English and Arabic languages, and real-time bus tracking.

## Features Implemented

### Core Features
- User authentication (login, registration, forgot password)
- Home screen with search functionality
- Bus listing with filtering and sorting
- Bus details view
- Interactive seat selection interface
- Passenger information collection
- Payment processing
- Booking confirmation
- Ticket management (viewing, upcoming/past tickets)

### Arabic Language Support
- Complete Arabic translations for all app text
- Right-to-left (RTL) layout support
- Language switcher component
- Proper text alignment and UI element positioning in RTL mode
- Language preference persistence between app sessions

### Bus Location Tracking
- Interactive maps using react-native-maps
- Real-time bus location tracking with animated updates
- Route visualization between current location and destination
- Detailed tracking screen with:
  - Estimated arrival time
  - Distance and time remaining
  - Bus status indicators (on time, delayed, arriving)
  - Journey details
- Refresh functionality for location updates

## Project Structure
```
bus-tickets-app/
├── BusTicketsApp/
│   ├── src/
│   │   ├── assets/              # Images, fonts, and other static assets
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Generic components including LanguageSwitcher
│   │   │   ├── auth/            # Authentication related components
│   │   │   ├── booking/         # Booking related components
│   │   │   └── payment/         # Payment related components
│   │   ├── contexts/            # React contexts including LanguageContext
│   │   ├── i18n/                # Internationalization setup
│   │   │   ├── locales/         # Translation files (en.json, ar.json)
│   │   │   └── index.js         # i18n configuration
│   │   ├── navigation/          # Navigation configuration
│   │   ├── screens/             # Screen components
│   │   │   ├── auth/            # Authentication screens
│   │   │   ├── home/            # Home and search screens
│   │   │   ├── booking/         # Booking flow screens
│   │   │   ├── payment/         # Payment screens
│   │   │   ├── profile/         # User profile screens
│   │   │   ├── tickets/         # Ticket management screens
│   │   │   └── tracking/        # Bus tracking screens
│   │   ├── services/            # API services and other external services
│   │   ├── store/               # Redux store configuration
│   │   ├── utils/               # Utility functions and helpers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── constants/           # App constants and configuration
│   │   └── theme/               # Theme configuration
│   ├── App.js                   # Root component with i18n and language providers
│   └── index.js                 # Entry point
├── requirements.md              # App requirements and user stories
└── architecture.md              # App architecture documentation
```

## Technology Stack
- **Frontend Framework**: React Native
- **State Management**: Redux with Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Form Handling**: Formik with Yup validation
- **Internationalization**: i18next, react-i18next
- **Maps & Location**: react-native-maps

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation Steps
1. Clone the repository
2. Navigate to the project directory: `cd BusTicketsApp`
3. Install dependencies: `npm install` or `yarn install`
4. Start the Metro bundler: `npx react-native start`
5. Run on Android: `npx react-native run-android`
6. Run on iOS: `npx react-native run-ios` (macOS only)

## Language Support
The app supports the following languages:
- English (default)
- Arabic (with RTL layout)

Users can switch languages via the language switcher component available in the app. The app will remember the user's language preference between sessions.

## Bus Tracking Feature
The bus tracking feature allows users to:
- View the real-time location of their bus on a map
- See the estimated arrival time
- Monitor distance and time remaining
- Check bus status (on time, delayed, arriving)
- View journey details

To access the tracking feature, users can navigate to it from:
- The ticket details screen
- The bus details screen (for upcoming journeys)

## Testing
The app includes comprehensive test coverage:
- Authentication flow tests
- Search and booking flow tests
- Ticket management tests
- Language switching and RTL layout tests
- Bus tracking functionality tests

All tests have passed successfully, ensuring the app functions as expected across all core features.

## Future Enhancements
- Additional language support (French, Spanish, etc.)
- Enhanced tracking with traffic information
- Push notifications for bus status updates
- Offline mode for tracking
- Sharing bus location with others
- In-app chat support in multiple languages

## Contact
For any questions or support, please contact the development team.
