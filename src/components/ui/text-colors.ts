import { Color } from 'expo-router';
import { useColorScheme, type ColorValue } from 'react-native';

export type TextTone = 'primary' | 'secondary';

// System text colours, so text stays readable in light, dark and high-contrast modes.
// iOS: UIKit's label colours. Android: Material 3 roles (wallpaper-based on Android 12+).
// Android colours are looked up for the current light/dark mode, so useColorScheme()
// makes the text re-render when the mode changes.
export function useTextColor(tone: TextTone): ColorValue {
  useColorScheme();
  if (process.env.EXPO_OS === 'ios') {
    return tone === 'primary' ? Color.ios.label : Color.ios.secondaryLabel;
  }
  return tone === 'primary' ? Color.android.dynamic.onSurface : Color.android.dynamic.onSurfaceVariant;
}
