# Managex Mobile - Task & Note Manager

A professional React Native mobile application for task scheduling and note-taking, converted from the original web application while maintaining the same UI design and functionality.

## Features

- **Task Management**: Create, edit, delete, and organize tasks with priorities, categories, and due dates
- **Note Taking**: Rich text notes with tagging and pinning capabilities
- **Analytics**: Productivity insights and statistics
- **Cross-platform**: Runs on both iOS and Android
- **Offline Support**: Local data storage with AsyncStorage
- **Modern UI**: Material Design 3 components with React Native Paper

## Tech Stack

- **React Native 0.72.6**
- **React Navigation 6** - Navigation and routing
- **React Native Paper** - Material Design 3 UI components
- **Zustand** - State management
- **AsyncStorage** - Local data persistence
- **Date-fns** - Date manipulation
- **React Native Vector Icons** - Icon library

## Installation

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **iOS Setup:**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android Setup:**
   Make sure Android Studio is installed and configured

### Running the App

**Start Metro bundler:**
```bash
npm start
```

**Run on Android:**
```bash
npm run android
```

**Run on iOS:**
```bash
npm run ios
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TaskCard.tsx
│   ├── NoteCard.tsx
│   ├── TaskFilters.tsx
│   └── NoteFilters.tsx
├── screens/            # Screen components
│   ├── AuthScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── NotesScreen.tsx
│   ├── AnalyticsScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── TaskFormScreen.tsx
│   └── NoteFormScreen.tsx
├── navigation/         # Navigation configuration
│   └── MainTabNavigator.tsx
├── lib/               # Business logic and utilities
│   ├── task-store.ts
│   ├── note-store.ts
│   ├── settings-store.ts
│   ├── analytics.ts
│   └── types.ts
├── theme.ts           # App theme configuration
└── App.tsx           # Root component
```

## Key Features Converted

### ✅ Authentication
- Sign in/Sign up forms
- Google authentication placeholder
- Session management

### ✅ Task Management
- Create, edit, delete tasks
- Priority levels (High, Medium, Low)
- Categories and tags
- Due dates with date picker
- Progress tracking
- Recurring tasks
- Task completion toggle

### ✅ Note Taking
- Rich text notes (simplified for mobile)
- Pinning functionality
- Color coding
- Tag system
- Search and filtering

### ✅ Analytics
- Productivity score calculation
- Task completion statistics
- Priority distribution
- Category breakdown
- Note insights

### ✅ Settings
- Theme preferences
- Notification settings
- Auto-save configuration
- Voice-to-text settings
- Data export/import
- Settings reset

### ✅ Navigation
- Bottom tab navigation
- Stack navigation for forms
- Proper screen transitions

## Mobile-Specific Adaptations

1. **Navigation**: Converted from web routing to React Navigation
2. **UI Components**: Replaced web components with React Native Paper
3. **Storage**: AsyncStorage instead of localStorage
4. **Date Picker**: Native date picker component
5. **Icons**: React Native Vector Icons
6. **Forms**: Mobile-optimized form layouts
7. **Responsive Design**: Adapted for mobile screen sizes

## Building for Production

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both platforms
5. Submit a pull request

## License

This project is licensed under the MIT License.