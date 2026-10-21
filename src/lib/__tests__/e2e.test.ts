import { LogBox } from 'react-native';

import { configureForE2E, isE2E } from '@/lib/e2e';

describe('configureForE2E', () => {
  const ignoreAllLogs = jest.spyOn(LogBox, 'ignoreAllLogs').mockImplementation(() => undefined);

  afterEach(() => {
    ignoreAllLogs.mockClear();
  });

  it('leaves dev warnings on in normal runs', () => {
    expect(isE2E).toBe(false);
    configureForE2E();
    expect(ignoreAllLogs).not.toHaveBeenCalled();
  });

  it('hides dev warnings in E2E runs', () => {
    configureForE2E(true);
    expect(ignoreAllLogs).toHaveBeenCalledWith(true);
  });
});
