import { LogBox } from 'react-native';

// Set when Metro is started for Maestro runs (`EXPO_PUBLIC_E2E=true npx expo start`)
// or when CI builds the E2E app. Expo inlines EXPO_PUBLIC_* values at bundle time,
// so this needs no native module.
export const isE2E = process.env.EXPO_PUBLIC_E2E === 'true';

// Call once from src/app/_layout.tsx. Hides the dev warning overlay, which otherwise
// covers elements Maestro needs to tap.
export function configureForE2E() {
  if (isE2E) LogBox.ignoreAllLogs(true);
}
