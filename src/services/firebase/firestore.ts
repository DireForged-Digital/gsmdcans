import { connectFirestoreEmulator, getFirestore } from '@react-native-firebase/firestore';

import { emulatorHost, useEmulators } from './env';

export const db = getFirestore();

if (useEmulators) {
  connectFirestoreEmulator(db, emulatorHost, 8080);
}
