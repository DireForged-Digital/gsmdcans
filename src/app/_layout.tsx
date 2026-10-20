import { configureForE2E } from '@/lib/e2e';
import { Stack } from 'expo-router';

configureForE2E();

export default function RootLayout() {
  return <Stack />;
}
