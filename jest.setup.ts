// Unit and component tests never talk to Firebase: they get data from the fake repository
// (src/test/fakes). React Native Firebase's native modules don't exist under Jest, so stub
// the Firestore entry point in case a test imports it indirectly (e.g. through _layout).
jest.mock('@/services/firebase/firestore', () => ({ db: {} }));
