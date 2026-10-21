// eslint-disable-next-line no-restricted-imports -- ThemedText is the one place allowed to wrap RN Text
import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { useTextColor } from './text-colors';

type Variant = 'title' | 'body' | 'secondary';

export interface ThemedTextProps extends TextProps {
  variant?: Variant;
}

/** All app text goes through here. Font scaling stays on: never cap it without a reason in a comment. */
export function ThemedText({ variant = 'body', style, ...rest }: ThemedTextProps) {
  const color = useTextColor(variant === 'secondary' ? 'secondary' : 'primary');
  return (
    <Text
      accessibilityRole={variant === 'title' ? 'header' : undefined}
      {...rest}
      style={[styles[variant], { color }, style]}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: Platform.select({ ios: 17, default: 16 }) },
  secondary: { fontSize: Platform.select({ ios: 15, default: 14 }) },
});
