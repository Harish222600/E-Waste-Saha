# Frontend - React Native (Expo)

This is the frontend mobile application for the Sahana Project, built with React Native and Expo.

## Features

- React Native with Expo
- Cross-platform (iOS & Android)
- Hot reload for development
- Ready for API integration

## Installation

```bash
npm install
```

## Running the App

### Start the development server
```bash
npm start
```

This will open Expo DevTools in your browser. From there you can:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan QR code with Expo Go app on your physical device

### Run on specific platform
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

## Project Structure

```
frontend/
├── App.js          # Main application component
├── assets/         # Images, fonts, and other assets
├── app.json        # Expo configuration
├── package.json    # Dependencies and scripts
└── .gitignore      # Git ignore file
```

## Connecting to Backend

To connect to your backend API, you'll need to update the API base URL in your app. The backend runs on `http://localhost:5000` by default.

For testing on physical devices, replace `localhost` with your computer's IP address.

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **JavaScript/JSX** - Programming language

## Next Steps

1. Create screens and components
2. Set up navigation (React Navigation)
3. Integrate with backend API
4. Add state management (Context API or Redux)
5. Style your components
