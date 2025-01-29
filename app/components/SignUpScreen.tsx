import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { router } from 'expo-router';
import storage from '../lib/storage';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!username || !password) {
        alert('Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const users = await storage.getUsers();
      if (users[username]) {
        alert('Username already exists');
        return;
      }

      const newUser = { username, password, score: 0 };
      await storage.saveUser(newUser);
      await storage.setCurrentUser(newUser);
      alert('Account created successfully!');
      router.replace('/home');
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Sign up failed. Please try again.');
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Sign Up for Guess the Pokémon</Text>
      
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

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Confirm Password"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleSignUp}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/login')}>
        <Text style={[styles.loginText, isDarkMode && styles.darkText]}>Already have an account? Login</Text>
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
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
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