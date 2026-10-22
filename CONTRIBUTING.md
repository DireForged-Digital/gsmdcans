# Contributing

Thanks for helping! This guide covers how changes get from an idea to `main`.

## Before you start

- **Bugs and ideas:** open an issue with one of the forms first, so we can agree on the
  approach before you write code. Small fixes (typos, obvious bugs) can go straight to a PR.
- **Security issues:** don't open a public issue; follow [SECURITY.md](SECURITY.md).
- Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## Setting up

Follow **Getting started** in the [README](README.md). You'll need a Mac with Xcode and
Android Studio to run the native apps; web-only changes need just Node and pnpm (via mise).

## Making a change

1. Create a branch from `main`, e.g. `feat/event-list` or `fix/login-crash`.
2. Make the change, with tests:
   - components and hooks: Jest + Testing Library, querying by role and label rather than `testID`
   - Firestore rules: a case in `firebase/tests/`
   - new screens: a Maestro flow in `.maestro/` if it's part of a main user journey
3. Run the checks:
   ```sh
   pnpm typecheck && pnpm lint && pnpm test
   ```
   plus `pnpm test:rules`, `pnpm e2e` or `pnpm e2e:web` when you touched those areas.
4. Commit using [Conventional Commits](https://www.conventionalcommits.org)
   (`feat:`, `fix:`, `docs:`, `chore:` …). A git hook checks the format, and release notes
   are generated from these messages.
5. Open a pull request and fill in the template, including the accessibility checklist for
   UI changes. CI must pass before merging.

## Code style

Prettier and ESLint are the source of truth; `pnpm format` and `pnpm lint:fix` fix most
things. VS Code users get format-on-save from the workspace settings.

- All text goes through `ThemedText`; don't import `Text` from `react-native`.
- Firebase is only used inside `src/services/firebase/`; screens get data through the
  repository and TanStack Query.
- Accessibility is part of "done": see [docs/testing/accessibility.md](docs/testing/accessibility.md).
