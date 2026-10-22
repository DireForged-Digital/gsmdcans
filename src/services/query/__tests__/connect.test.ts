import { focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { AppState } from 'react-native';

import { connectQueryToApp } from '../connect';

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({ isConnected: true })),
  addNetworkStateListener: jest.fn(() => ({ remove: jest.fn() })),
}));

describe('connectQueryToApp', () => {
  it('pauses queries while the network is down', () => {
    connectQueryToApp();
    const onChange = jest.mocked(Network.addNetworkStateListener).mock.lastCall![0];

    onChange({ isConnected: false });
    expect(onlineManager.isOnline()).toBe(false);

    onChange({ isConnected: true });
    expect(onlineManager.isOnline()).toBe(true);
  });

  it('treats the app as focused only while it is in the foreground', () => {
    const addListener = jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation(() => ({ remove: jest.fn() }));
    connectQueryToApp();
    const onChange = addListener.mock.lastCall![1];

    onChange('background');
    expect(focusManager.isFocused()).toBe(false);

    onChange('active');
    expect(focusManager.isFocused()).toBe(true);
  });
});
