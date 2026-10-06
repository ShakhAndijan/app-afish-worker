import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACTOR_TYPE_KEY = 'actor_type';

// Tokenlar iOS Keychain / Android Keystore'da shifrlangan holda saqlanadi.
// SecureStore web'da mavjud emas — u yerda AsyncStorage'ga tushamiz.
const useSecure = Platform.OS !== 'web';

const storage = useSecure
  ? {
      get: (key) => SecureStore.getItemAsync(key),
      set: (key, value) =>
        SecureStore.setItemAsync(key, value, {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
        }),
      remove: (key) => SecureStore.deleteItemAsync(key),
    }
  : {
      get: (key) => AsyncStorage.getItem(key),
      set: (key, value) => AsyncStorage.setItem(key, value),
      remove: (key) => AsyncStorage.removeItem(key),
    };

// Avval AsyncStorage'da (shifrlanmagan) saqlangan sessiyani bir marta
// SecureStore'ga ko'chiramiz — yangilanishdan keyin foydalanuvchi logout bo'lmaydi.
let migration = null;
function migrateLegacyTokens() {
  if (!useSecure) return Promise.resolve();
  if (!migration) {
    migration = (async () => {
      try {
        for (const key of [TOKEN_KEY, REFRESH_TOKEN_KEY, ACTOR_TYPE_KEY]) {
          const legacy = await AsyncStorage.getItem(key);
          if (legacy == null) continue;
          if ((await storage.get(key)) == null) await storage.set(key, legacy);
          await AsyncStorage.removeItem(key);
        }
      } catch {
        // Keyingi chaqiruvda qayta uriniladi.
        migration = null;
      }
    })();
  }
  return migration;
}

const read = async (key) => {
  await migrateLegacyTokens();
  return storage.get(key);
};

const write = async (key, value) => {
  await migrateLegacyTokens();
  return storage.set(key, value);
};

export const saveToken = (token) => write(TOKEN_KEY, token);
export const getToken = () => read(TOKEN_KEY);
export const saveRefreshToken = (token) => write(REFRESH_TOKEN_KEY, token);
export const getRefreshToken = () => read(REFRESH_TOKEN_KEY);
export const getActorType = () => read(ACTOR_TYPE_KEY);

export const clearTokens = async () => {
  await migrateLegacyTokens();
  await Promise.all(
    [TOKEN_KEY, REFRESH_TOKEN_KEY, ACTOR_TYPE_KEY].map((key) =>
      storage.remove(key).catch(() => {})
    )
  );
};

/**
 * Muvaffaqiyatli kirishdan keyin butun sessiyani bir joyda saqlaydi.
 * Yangi sessiya refresh token bermasa, avvalgi foydalanuvchining eski
 * refresh tokeni qolib ketmasligi uchun u o'chiriladi.
 */
export const saveSession = async ({ accessToken, refreshToken, actorType }) => {
  if (!accessToken) throw new Error('Server access token qaytarmadi');
  await write(TOKEN_KEY, accessToken);
  if (refreshToken) await write(REFRESH_TOKEN_KEY, refreshToken);
  else await storage.remove(REFRESH_TOKEN_KEY);
  await write(ACTOR_TYPE_KEY, actorType);
};
