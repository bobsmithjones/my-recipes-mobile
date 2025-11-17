// src/utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveObject<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (err) {
    console.warn(`Error saving key "${key}" to storage:`, err);
  }
}

export async function loadObject<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch (err) {
    console.warn(`Error loading key "${key}" from storage:`, err);
    return null;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`Error removing key "${key}" from storage:`, err);
  }
}
