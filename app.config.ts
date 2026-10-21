import type { ConfigContext, ExpoConfig } from 'expo/config';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import pkg from './package.json';

// Static settings live in app.json so `npx expo install` and `eas init` can edit them.
// This file only adds what differs per build variant.

type Variant = 'development' | 'production';
const variant = (process.env.APP_VARIANT ?? 'development') as Variant;
const isProd = variant === 'production';

// Choose this carefully: it can't change once the app is in the stores.
const baseId = 'digital.direforged.gsmdcans';

const bundleId = {
  development: `${baseId}.dev`,
  production: baseId,
}[variant];

const appName = {
  development: 'GSMDCA NS (Dev)',
  production: 'GSMDCA NS',
}[variant];

const firebaseDir = isProd ? './firebase/prod' : './firebase/dev';

// Firebase config files arrive in Phase 3 (and come from EAS secrets on CI).
// Only point at them when they exist, so prebuild works before Firebase is set up.
const ifExists = (path: string | undefined) => (path && existsSync(path) ? path : undefined);
const plist = ifExists(process.env.GOOGLE_SERVICES_PLIST ?? `${firebaseDir}/GoogleService-Info.plist`);
const googleJson = ifExists(process.env.GOOGLE_SERVICES_JSON ?? `${firebaseDir}/google-services.json`);

// Unique, increasing native build number from git history; 1 outside a git checkout.
const buildNumber = (() => {
  try {
    return (
      Number(
        execSync('git rev-list --count HEAD', {
          stdio: ['ignore', 'pipe', 'ignore'],
        })
          .toString()
          .trim(),
      ) || 1
    );
  } catch {
    return 1;
  }
})();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: config.slug ?? 'gsmdcans',
  version: pkg.version,
  ios: {
    ...config.ios,
    bundleIdentifier: bundleId,
    buildNumber: String(buildNumber),
    ...(plist && { googleServicesFile: plist }),
    entitlements: {
      ...config.ios?.entitlements,
      'aps-environment': isProd ? 'production' : 'development',
    },
  },
  android: {
    ...config.android,
    package: bundleId,
    versionCode: buildNumber,
    ...(googleJson && { googleServicesFile: googleJson }),
  },
  extra: { ...config.extra, appVariant: variant },
});
