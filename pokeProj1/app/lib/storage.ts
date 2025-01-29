import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  username: string;
  password: string;
  score: number;
  highScore: number;
}

const storage = {
  initializeDatabase: async () => {
    // No initialization needed for AsyncStorage
  },

  async getUsers(): Promise<Record<string, User>> {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      return usersJson ? JSON.parse(usersJson) : {};
    } catch (error) {
      console.error('Error getting users:', error);
      return {};
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const users = await storage.getUsers();
      users[user.username] = user;
      await AsyncStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const username = await AsyncStorage.getItem('current_user');
      if (username) {
        const users = await storage.getUsers();
        return users[username] || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async setCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem('current_user', user.username);
      } else {
        await AsyncStorage.removeItem('current_user');
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem('users');
      await AsyncStorage.removeItem('current_user');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default storage;