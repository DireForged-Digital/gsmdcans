import { ThemedText } from '@/components/ui/ThemedText';
import { Redirect, Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

// Development-only component gallery: every src/components/ui primitive in its
// awkward states (loading, empty, error, very long text, disabled), so you can check
// them without clicking through the app. Check dark mode and the largest text size here.
// Not shipped: production builds redirect away.
// Swap for Storybook once src/components/ui has 10+ components with several variants.

export default function Gallery() {
  if (!__DEV__) return <Redirect href="/" />;

  return (
    <>
      <Stack.Screen options={{ title: 'Component gallery' }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Section title="ThemedText">
          <ThemedText variant="title">Title text</ThemedText>
          <ThemedText>
            Body text that wraps across several lines to show how longer paragraphs behave when the system
            text size is turned up.
          </ThemedText>
          <ThemedText variant="secondary">Secondary text</ThemedText>
        </Section>
      </ScrollView>
    </>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText variant="title">{title}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 24 },
  section: { gap: 12 },
});
