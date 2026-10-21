import { LogBox } from 'react-native';

// Set when Metro is started for Maestro runs (`EXPO_PUBLIC_E2E=true npx expo start`)
// or when CI builds the E2E app. Expo inlines EXPO_PUBLIC_* values at bundle time,
// so this needs no native module.
export const isE2E = process.env.EXPO_PUBLIC_E2E === 'true';

// Defaults to the build-time flag; tests pass the value explicitly.
export function configureForE2E(enabled = isE2E) {
  if (enabled) LogBox.ignoreAllLogs(true);
}
