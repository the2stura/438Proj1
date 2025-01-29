import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoaded();
      router.replace('/home'); // Ensure this navigates to the home screen
    }, 3000); // Show the loading screen for 3 seconds

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guess the Pokémon</Text>
      <Text style={styles.subtitle}>(GTP)</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Set a background color if needed
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 24,
    color: '#007AFF',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
}); 