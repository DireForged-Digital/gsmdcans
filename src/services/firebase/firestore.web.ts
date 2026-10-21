import { getApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

import './app';
import { emulatorHost, useEmulators } from './env';

// Native keeps an offline cache by default; on web it has to be switched on.
export const db = initializeFirestore(getApp(), {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

if (useEmulators) {
  connectFirestoreEmulator(db, emulatorHost, 8080);
}
