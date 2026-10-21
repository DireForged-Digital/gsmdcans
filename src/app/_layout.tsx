import { configureForE2E } from '@/lib/e2e';
import '@/services/firebase/app';
import { Stack } from 'expo-router';

configureForE2E();

export default function RootLayout() {
  return <Stack />;
}
