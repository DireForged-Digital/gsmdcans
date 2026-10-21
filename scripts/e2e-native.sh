#!/usr/bin/env bash
# Runs the Maestro smoke flows on the iOS Simulator and/or the Android emulator.
# Usage: pnpm e2e            (both platforms, normal text, light mode)
#        pnpm e2e:a11y       (both platforms: maximum text size, then dark mode)
#        pnpm e2e:ios | pnpm e2e:android
# Modes (2nd argument, space-separated): normal | large-text | dark
# Optional: IOS_SIMULATOR="iPhone 17" or ANDROID_AVD="Pixel_9" to choose devices.
# Screenshots of every flow are saved to e2e-screenshots/ (git-ignored) for review.
# Devices are left at normal text size in light mode afterwards.
set -euo pipefail
set -m # background jobs get their own process group, so cleanup can stop all of Metro

PLATFORMS=${1:-"ios android"}
MODES=${2:-normal}
METRO_URL="http://localhost:8081"
METRO_LOG="${TMPDIR:-/tmp}/gsmdcans-metro-e2e.log"
EMULATOR_BIN="${ANDROID_HOME:-$HOME/Library/Android/sdk}/emulator/emulator"
SHOTS_DIR="e2e-screenshots"
mkdir -p "$SHOTS_DIR"

# The dev build's ID, read from app.config.ts so it never drifts.
APP_ID=$(APP_VARIANT=development npx expo config --type public --json 2>/dev/null |
  node -e 'console.log(JSON.parse(require("fs").readFileSync(0, "utf8")).ios.bundleIdentifier)')

# $1 = simulator udid, $2 = mode
ios_settings() {
  local size=large appearance=light
  case "$2" in
    large-text) size=accessibility-extra-extra-extra-large ;;
    dark) appearance=dark ;;
  esac
  xcrun simctl ui "$1" content_size "$size"
  xcrun simctl ui "$1" appearance "$appearance"
}

# $1 = emulator serial, $2 = mode
android_settings() {
  local scale=1.0 night=no
  case "$2" in
    large-text) scale=2.0 ;;
    dark) night=yes ;;
  esac
  adb -s "$1" shell settings put system font_scale "$scale" >/dev/null
  adb -s "$1" shell cmd uimode night "$night" >/dev/null
}

METRO_PID=""
ANDROID_STARTED=""
IOS_RESET=""
ANDROID_RESET=""
cleanup() {
  # Put devices back to normal even if a flow failed.
  [ -n "$IOS_RESET" ] && ios_settings "$IOS_RESET" normal >/dev/null 2>&1 || true
  [ -n "$ANDROID_RESET" ] && android_settings "$ANDROID_RESET" normal >/dev/null 2>&1 || true
  [ -n "$METRO_PID" ] && kill -- -"$METRO_PID" 2>/dev/null || true
  [ -n "$ANDROID_STARTED" ] && adb -s "$ANDROID_STARTED" emu kill >/dev/null 2>&1 || true
}
trap cleanup EXIT

metro_running() { curl -s "$METRO_URL/status" | grep -q "packager-status:running"; }

# 1. Metro in E2E mode (reuses one you already started).
if metro_running; then
  echo "Using the Metro already running (make sure it was started with EXPO_PUBLIC_E2E=true)."
else
  echo "Starting Metro in E2E mode (log: ${METRO_LOG})..."
  EXPO_PUBLIC_E2E=true CI=1 npx expo start >"$METRO_LOG" 2>&1 &
  METRO_PID=$!
  until metro_running; do sleep 1; done
fi

# $1 = device, $2 = platform name, $3 = mode (both used in screenshot file names)
run_maestro() {
  local out status=0
  out=$(mktemp -d "${TMPDIR:-/tmp}/gsmdcans-maestro.XXXXXX")
  maestro --device "$1" test \
    --test-output-dir "$out" \
    -e APP_ID="$APP_ID" \
    -e SHOT_PREFIX="${2}-${3}" \
    --include-tags smoke .maestro || status=$?
  # Maestro keeps screenshots in its own output folder; copy them into the project.
  find "$out" -path '*/takeScreenshot/*.png' -exec cp {} "$SHOTS_DIR"/ \;
  if [ "$status" -eq 0 ]; then
    rm -rf "$out"
  else
    echo "Maestro output (screen captures and logs of the failure): ${out}"
  fi
  return "$status"
}

run_ios() {
  local udid mode
  if [ -n "${IOS_SIMULATOR:-}" ]; then
    udid=$(xcrun simctl list devices available | grep -m1 "    $IOS_SIMULATOR (" | grep -oE '[0-9A-F-]{36}')
  else
    udid=$(xcrun simctl list devices booted | grep -m1 -oE '[0-9A-F-]{36}' || true)
    [ -z "$udid" ] && udid=$(xcrun simctl list devices available | grep -m1 "iPhone" | grep -oE '[0-9A-F-]{36}')
  fi
  echo "iOS: booting simulator ${udid}..."
  xcrun simctl boot "$udid" 2>/dev/null || true
  # Show the simulator window if macOS can find the app (optional; tests run without it).
  open -b com.apple.iphonesimulator 2>/dev/null || true
  xcrun simctl bootstatus "$udid" -b >/dev/null
  if ! xcrun simctl get_app_container "$udid" "$APP_ID" >/dev/null 2>&1; then
    echo "iOS: the dev build isn't installed on this simulator. Run 'pnpm ios' once, then try again."
    return 1
  fi
  IOS_RESET=$udid
  for mode in $MODES; do
    echo "iOS: running in ${mode} mode..."
    ios_settings "$udid" "$mode"
    run_maestro "$udid" ios "$mode"
  done
}

run_android() {
  local serial mode
  serial=$(adb devices | awk '/^emulator-/{print $1; exit}')
  if [ -z "$serial" ]; then
    local avd=${ANDROID_AVD:-$("$EMULATOR_BIN" -list-avds | head -1)}
    echo "Android: starting emulator ${avd}..."
    "$EMULATOR_BIN" -avd "$avd" -no-snapshot-save >/dev/null 2>&1 &
    adb wait-for-device
    serial=$(adb devices | awk '/^emulator-/{print $1; exit}')
    ANDROID_STARTED=$serial
  fi
  until [ "$(adb -s "$serial" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do sleep 2; done
  adb -s "$serial" reverse tcp:8081 tcp:8081 >/dev/null # lets the emulator reach Metro at localhost
  if ! adb -s "$serial" shell pm list packages | tr -d '\r' | grep -qx "package:$APP_ID"; then
    echo "Android: the dev build isn't installed on this emulator. Run 'pnpm android' once, then try again."
    return 1
  fi
  ANDROID_RESET=$serial
  for mode in $MODES; do
    echo "Android: running in ${mode} mode..."
    android_settings "$serial" "$mode"
    run_maestro "$serial" android "$mode"
  done
}

for platform in $PLATFORMS; do
  "run_$platform"
done
echo "✅ Maestro smoke flows passed (${MODES}) on: ${PLATFORMS}. Screenshots: ${SHOTS_DIR}/"