import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@app_auth';
const PASSWORD_KEY = '@app_password';

const DEFAULT_PASSWORD = '1234';

export async function initializePassword() {
  const savedPassword = await AsyncStorage.getItem(PASSWORD_KEY);

  if (!savedPassword) {
    await AsyncStorage.setItem(PASSWORD_KEY, DEFAULT_PASSWORD);
  }
}

export async function getStoredPassword() {
  return await AsyncStorage.getItem(PASSWORD_KEY);
}

export async function validatePassword(password: string) {
  const storedPassword = await getStoredPassword();
  return storedPassword === password;
}

export async function saveSession() {
  await AsyncStorage.setItem(AUTH_KEY, 'true');
}

export async function removeSession() {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function getSession() {
  const session = await AsyncStorage.getItem(AUTH_KEY);
  return session === 'true';
}