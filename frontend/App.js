import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PostEWasteScreen from './src/screens/PostEWasteScreen';
import MyEWasteScreen from './src/screens/MyEWasteScreen';
import AllEWasteScreen from './src/screens/AllEWasteScreen';
import EWasteDetailScreen from './src/screens/EWasteDetailScreen';
import EditEWasteScreen from './src/screens/EditEWasteScreen';
import PostBulkEWasteScreen from './src/screens/PostBulkEWasteScreen';
import MyBulkPostsScreen from './src/screens/MyBulkPostsScreen';
import AllBulkPostsScreen from './src/screens/AllBulkPostsScreen';
import BulkEWasteDetailScreen from './src/screens/BulkEWasteDetailScreen';
import EditBulkEWasteScreen from './src/screens/EditBulkEWasteScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStack({ user }) {
  // Determine initial route based on user role
  const getInitialRoute = () => {
    if (user?.role === 'collector') return 'AllEWaste';
    if (user?.role === 'organization') return 'AllBulkPosts';
    return 'Dashboard';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PostEWaste" component={PostEWasteScreen} />
      <Stack.Screen name="MyEWaste" component={MyEWasteScreen} />
      <Stack.Screen name="AllEWaste" component={AllEWasteScreen} />
      <Stack.Screen name="EWasteDetail" component={EWasteDetailScreen} />
      <Stack.Screen name="EditEWaste" component={EditEWasteScreen} />
      <Stack.Screen name="PostBulkEWaste" component={PostBulkEWasteScreen} />
      <Stack.Screen name="MyBulkPosts" component={MyBulkPostsScreen} />
      <Stack.Screen name="AllBulkPosts" component={AllBulkPostsScreen} />
      <Stack.Screen name="BulkEWasteDetail" component={BulkEWasteDetailScreen} />
      <Stack.Screen name="EditBulkEWaste" component={EditBulkEWasteScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App">
            {() => <AppStack user={user} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <MainNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
