// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores a value in AsyncStorage under the specified key.
 */
export const setItemToLocalStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    
  }
};

/**
 * Retrieves a value from AsyncStorage by key.
 */
export const getItemFromLocalStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (error) {
    
    return null;
  }
};

/**
 * Removes a value from AsyncStorage by key.
 */
export const removeItemFromLocalStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    
  }
};
