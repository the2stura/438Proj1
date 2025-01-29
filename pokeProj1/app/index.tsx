import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import storage from './lib/storage';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    storage.initializeDatabase(); // Initialize the database

    const checkAuth = async () => {
      try {
        const currentUser = await storage.getCurrentUser();
        if (currentUser) {
          router.replace('/home');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    if (isLoaded) {
      checkAuth();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingScreen onLoaded={() => setIsLoaded(true)} />;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
