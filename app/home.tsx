import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import GameScreen from './components/GameScreen';
import { router } from 'expo-router';
import storage from './lib/storage';

export default function Home() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await storage.getCurrentUser();
        if (!currentUser) {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <GameScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 