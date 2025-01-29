import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { router } from 'expo-router';
import storage from '../lib/storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        alert('Please fill in all fields');
        return;
      }

      const users = await storage.getUsers();
      const user = users[username];

      if (user && user.password === password) {
        await storage.setCurrentUser(user);
        alert('Welcome back, ' + username + '!');
        router.replace('/home');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleSignUp = () => {
    router.replace('/signup');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Welcome to Guess the Pokémon</Text>
      
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Username"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleLogin}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleText, isDarkMode && styles.darkText]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff', // Light blue background
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#007AFF',
  },
  darkText: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  darkInput: {
    backgroundColor: '#555',
    borderColor: '#444',
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  darkButton: {
    backgroundColor: '#005BBB',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  darkButtonText: {
    color: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    fontSize: 16,
    marginRight: 10,
  },
}); 