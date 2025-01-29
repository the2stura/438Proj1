import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import storage from '../lib/storage';

interface Pokemon {
  name: string;
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
}

export default function GameScreen() {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [username, setUsername] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [streakAnimation] = useState(new Animated.Value(1));
  const [isImageMode, setIsImageMode] = useState<boolean>(true);

  const fetchPokemonData = async () => {
    try {
      const randomId = Math.floor(Math.random() * 898) + 1; // Assuming there are 898 Pokémon
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();

      // Fetch additional Pokémon for wrong answers
      const wrongAnswers = await Promise.all(
        Array.from({ length: 3 }, async () => {
          const wrongId = Math.floor(Math.random() * 898) + 1;
          const wrongResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${wrongId}`);
          const wrongData = await wrongResponse.json();
          return wrongData.name;
        })
      );

      const pokemonChoices = [data.name, ...wrongAnswers].sort(() => Math.random() - 0.5);

      setCurrentPokemon(data);
      setChoices(pokemonChoices);
      setSelectedChoice(null); // Reset selected choice
      setIsImageMode(Math.random() < 0.5); // Randomly choose mode
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await storage.getCurrentUser();
      if (currentUser) {
        setUsername(currentUser.username);
        setScore(currentUser.score);
        setHighScore(currentUser.highScore || 0);
      }
    };
    loadUser();
    const fetchData = async () => {
      try {
        await fetchPokemonData();
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };
    fetchData();
  }, []);

  const updateScore = async (newScore: number) => {
    try {
      const currentUser = await storage.getCurrentUser();
      if (currentUser) {
        currentUser.score = newScore;
        if (newScore > currentUser.highScore) {
          currentUser.highScore = newScore;
          setHighScore(newScore);
        }
        await storage.saveUser(currentUser);
        await storage.setCurrentUser(currentUser);
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleGuess = async (pokemonName: string) => {
    setSelectedChoice(pokemonName);
    if (currentPokemon && pokemonName === currentPokemon.name) {
      const newScore = score + 1;
      setScore(newScore);
      await updateScore(newScore);
      animateStreak();
      setTimeout(fetchPokemonData, 1000); // Delay to show color indication
    } else {
      setScore(0);
      setTimeout(fetchPokemonData, 1000); // Delay to show color indication
    }
  };

  const animateStreak = () => {
    Animated.sequence([
      Animated.timing(streakAnimation, {
        toValue: 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(streakAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSignOut = async () => {
    try {
      await storage.setCurrentUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!currentPokemon) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome, {username}!</Text>
          {score > 0 && (
            <Animated.Text style={[styles.streakText, { transform: [{ scale: streakAnimation }] }]}>
              Streak: {score} 🔥
            </Animated.Text>
          )}
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionText}>
          {isImageMode ? 'Guess the Pokémon' : 'Guess the Pokémon with these abilities:'}
        </Text>
        {isImageMode ? (
          <Image
            source={{ uri: currentPokemon.sprites.front_default }}
            style={styles.pokemonImage}
          />
        ) : (
          <View style={styles.abilitiesContainer}>
            {currentPokemon.abilities.map((ability, index) => (
              <View key={index} style={styles.ability}>
                <Text style={styles.abilityText}>{ability.ability.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.choicesContainer}>
        {choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              selectedChoice === choice && {
                backgroundColor: choice === currentPokemon.name ? 'green' : 'red',
              },
            ]}
            onPress={() => handleGuess(choice)}
            disabled={!!selectedChoice} // Disable buttons after a choice is made
          >
            <Text style={styles.choiceText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff', // Set a background color if needed
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  streakText: {
    fontSize: 20,
    color: '#FF4500',
    fontWeight: 'bold',
    marginTop: 5,
  },
  highScoreText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
  },
  pokemonImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 100, // Make the image circular
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ability: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 5,
    margin: 5,
  },
  abilityText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  choicesContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  choiceButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  choiceText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  signOutText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 