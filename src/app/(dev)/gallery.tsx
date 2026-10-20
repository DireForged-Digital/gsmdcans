import { Redirect, Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

// Development-only component gallery: every src/components/ui primitive in its
// awkward states (loading, empty, error, very long text, disabled), so you can check
// them without clicking through the app. Check dark mode and the largest text size here.
// Not shipped: production and preview builds redirect away.
// Swap for Storybook once src/components/ui has 10+ components with several variants.

export default function Gallery() {
  if (!__DEV__) return <Redirect href="/" />;

  return (
    <>
      <Stack.Screen options={{ title: 'Component gallery' }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        {/* One <Section> per component, e.g.:
            <Section title="EventCard">
              <EventCard event={fixtures.event} />
              <EventCard event={fixtures.eventLongTitle} />
              <EventCard event={fixtures.eventCancelled} />
            </Section> */}
      </ScrollView>
    </>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  // Swap accessibilityLabel for a ThemedText heading once src/components/ui has one.
  return (
    <View style={styles.section} accessibilityLabel={title}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 24 },
  section: { gap: 12 },
});
