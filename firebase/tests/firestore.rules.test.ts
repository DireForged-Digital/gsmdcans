import { readFileSync } from 'node:fs';

import {
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    // emulators:exec sets GCLOUD_PROJECT to your dev project; the emulator never touches the real one.
    projectId: process.env.GCLOUD_PROJECT ?? 'demo-rules',
    firestore: { rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

// Use the context's own Firestore methods (.doc/.get/.set) rather than importing from
// 'firebase/firestore': the test library may load a separate copy of the SDK, and Firestore
// rejects objects created by another copy.
describe('deny-all rules', () => {
  it('blocks reads from signed-out users', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(db.doc('anything/doc').get());
  });

  it('blocks writes from signed-in users', async () => {
    const db = env.authenticatedContext('alice').firestore();
    await assertFails(db.doc('anything/doc').set({ hello: 'world' }));
  });
});
