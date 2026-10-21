import { getApps, initializeApp } from 'firebase/app';

const raw = process.env.EXPO_PUBLIC_FIREBASE_WEB_CONFIG;
if (!raw) {
  throw new Error('EXPO_PUBLIC_FIREBASE_WEB_CONFIG is not set; see .env');
}

if (getApps().length === 0) {
  initializeApp(JSON.parse(raw) as Record<string, string>);
}
