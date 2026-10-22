import { focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { AppState } from 'react-native';

/**
 * Tell TanStack Query when the app is in the foreground and when it's online,
 * so stale queries refetch on return and on reconnect (browsers do this by themselves).
 * Call once at startup.
 */
export function connectQueryToApp(): void {
  onlineManager.setEventListener((setOnline) => {
    Network.getNetworkStateAsync()
      .then((state) => {
        setOnline(state.isConnected === true);
      })
      .catch(() => {
        // Keep TanStack's default (online) if the state can't be read.
      });
    const subscription = Network.addNetworkStateListener((state) => {
      setOnline(state.isConnected === true);
    });
    return () => {
      subscription.remove();
    };
  });

  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener('change', (status) => {
      handleFocus(status === 'active');
    });
    return () => {
      subscription.remove();
    };
  });
}
