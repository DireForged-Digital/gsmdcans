# Accessibility testing

Two layers:

| Layer                                                                      | What it checks                                                                                                                                  | When                                                          |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `pnpm e2e:a11y` (automated)                                                | The app launches and its screens render at the largest text size and in dark mode, on iOS and Android. Saves screenshots to `e2e-screenshots/`. | Every PR that changes UI                                      |
| Accessibility Inspector (iOS) and Accessibility Scanner (Android), by hand | Contrast ratios, touch-target sizes, missing labels, text that doesn't scale                                                                    | Before each release, and after adding a new kind of component |

## Automated run

```sh
pnpm e2e:a11y
```

The script runs the Maestro smoke flow in `large-text` mode, then in `dark` mode, on the iOS Simulator and the Android emulator. Afterwards it puts both devices back to normal text size and light mode.

Then open the four screenshots in `e2e-screenshots/` and check:

- `ios-large-text-home.png` and `android-large-text-home.png`: the text is very large, wraps, and nothing is cut off or overlapping.
- `ios-dark-home.png` and `android-dark-home.png`: the header and background are dark and the text is light and readable.

Maestro can tell that a screen exists, but not that it's readable, so look at the screenshots. That's how the invisible-text bug on Android was found.

## By hand: before you start

1. Start Metro and open the dev build on both devices:
   ```sh
   pnpm start
   ```
   In the Metro terminal, press **`i`** (iOS Simulator), then **`a`** (Android emulator).
2. **Close the dev menu** on each device. The tools audit whatever is on screen, so an open menu means you're auditing the menu instead of the app.
   - iOS: tap **Close**.
   - Android: tap **Continue** if the introduction shows, then press **Back** to close the menu sheet.
   - If the menu comes back (for example after a reload), close it again before the next audit.
3. Check each screen. As a minimum, check the home screen and the dev gallery, which shows every shared component. To open the gallery:
   ```sh
   xcrun simctl openurl booted "gsmdcans://gallery"
   adb shell am start -a android.intent.action.VIEW -d "gsmdcans://gallery"
   ```

## iOS: Accessibility Inspector

1. In Xcode, choose **Xcode → Open Developer Tool → Accessibility Inspector**.
2. In the Inspector's top-left drop-down (it usually says "All processes" or your Mac's name), choose the **Simulator**, then **GSMDCA NS (Dev)**.
3. Click **Audit** in the toolbar (the warning-triangle icon), then **Run Audit**.
4. For each finding, the **?** explains the problem and the **eye** icon highlights the element in the simulator.
5. Audit each screen you're checking.
6. Repeat with large text. Click **Settings** in the toolbar (the slider icon), drag **Dynamic Type** to the right end, and audit again. Put the slider back when you're done.
7. Optionally, repeat in dark mode: `xcrun simctl ui booted appearance dark`, then `... appearance light` to switch back.

## Android: Accessibility Scanner

1. **Install it.** On the emulator, open the **Play Store**, sign in with any Google account and install **Accessibility Scanner** (by Google). This needs an emulator image that includes Google Play.
2. **Turn it on.** Open Accessibility Scanner, tap **Turn on**, switch on **Accessibility Scanner** in the settings screen it opens, and allow its permissions. A blue floating check-mark button appears.
3. **Scan.** Open the app on the screen you want to check, tap the check-mark button and choose **Snapshot**. Tap each suggestion to highlight the element.
4. Scan each screen you're checking.
5. Optionally, repeat with large text (`adb shell settings put system font_scale 2.0`) and in dark mode (`adb shell cmd uimode night yes`). Put both back afterwards (`font_scale 1.0`, `night no`).
6. **Turn it off when you're done**: **Settings → Accessibility → Accessibility Scanner → off**. Its floating button covers the app and gets in the way of Maestro runs.

## Reading the results

- **Ignore the dev build's own UI.** The floating **Tools** button on Android and the dev menu exist only in development builds, so their findings don't matter.
- **Fix anything on your own components**, usually in the shared component rather than on the screen that uses it:
  - low contrast: use the system colours from `text-colors.ts` rather than hard-coded colours
  - touch target too small: at least 44×44 pt on iOS, 48×48 dp on Android
  - missing label: add `accessibilityLabel`, or put the text inside the control
  - text clipped at large sizes: remove fixed heights and let the text wrap
- If you decide not to fix a finding, write down why, for example in the PR description.
