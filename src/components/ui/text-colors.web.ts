import { useColorScheme, type ColorValue } from 'react-native';

export type TextTone = 'primary' | 'secondary';

// Fixed pairs with high contrast: secondary is about 7.5:1 on white and 10:1 on black.
const colors = {
  light: { primary: '#000000', secondary: '#545454' },
  dark: { primary: '#FFFFFF', secondary: '#B3B3B3' },
} as const;

export function useTextColor(tone: TextTone): ColorValue {
  return colors[useColorScheme() === 'dark' ? 'dark' : 'light'][tone];
}
