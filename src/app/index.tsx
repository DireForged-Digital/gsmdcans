import { ThemedText } from '@/components/ui/ThemedText';
import Head from 'expo-router/head';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container} testID="home-screen">
      <Head>
        <title>GSMDCA NS</title>
      </Head>
      <ThemedText>Edit src/app/index.tsx to edit this screen.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
