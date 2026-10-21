import type { Repository } from '@/services/repository';

// Real Firebase-backed repository. Feature methods are added here and use `db` from ./firestore.
export const firebaseRepository: Repository = {
  kind: 'firebase',
};
