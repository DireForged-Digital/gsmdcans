import { Platform } from 'react-native';

// Turn on in .env.local with EXPO_PUBLIC_USE_EMULATORS=1. Never active in release builds.
export const useEmulators = __DEV__ && process.env.EXPO_PUBLIC_USE_EMULATORS === '1';

// The Android emulator reaches your Mac at 10.0.2.2; the iOS simulator and web use localhost.
export const emulatorHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
