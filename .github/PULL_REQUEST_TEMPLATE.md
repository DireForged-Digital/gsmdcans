## What and why

<!-- What does this change, and why? Link the issue: "Closes #123". -->

## How to test

<!-- Steps a reviewer can follow, e.g. "open the gallery, turn on the largest text size". -->

## Screenshots

<!-- For UI changes: before/after on iOS and Android. Large-text and dark-mode
     screenshots come from `pnpm e2e:a11y` (saved in e2e-screenshots/). -->

## Checklist

- [ ] PR title follows Conventional Commits (`feat:`, `fix:`, `chore:` …)
- [ ] Tests added or updated (component tests query by role and label, not `testID`)
- [ ] `pnpm typecheck && pnpm lint && pnpm test` pass locally
- [ ] Firestore rules changed? Rules tests updated and `pnpm test:rules` passes

### Accessibility (for UI changes)

- [ ] Touch targets ≥ 44 pt (iOS) / 48 dp (Android), with space between them
- [ ] Text contrast ≥ 4.5:1 (3:1 for large text); non-text contrast ≥ 3:1
- [ ] Layout survives the largest text size (200%) without clipping or lost actions
- [ ] Every interactive element has a label, role and state; focus order is logical
- [ ] Nothing is conveyed by colour alone; nothing relies on dragging
- [ ] Headings announced; VoiceOver/TalkBack walkthrough done for new screens
- [ ] Web: axe passes, keyboard navigation works, focus is visible
- [ ] Timeouts and auto-updating content can be paused or last at least 20 s
