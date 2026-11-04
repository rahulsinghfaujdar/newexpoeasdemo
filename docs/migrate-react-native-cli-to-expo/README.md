# Migrating a React Native CLI app to Expo

This guide records the working migration path used for this project. The app keeps its Android and iOS native projects and adds Expo's tooling and modules around the existing React Native code.

## 1. Check the starting project

Before changing dependencies, confirm the React Native version, native project setup, app entry point, native modules, and any custom Gradle or Xcode changes. Keep a clean Git checkpoint so native configuration can be compared if prebuild changes are needed.

This repository already has `android/` and `ios/` projects. It uses Expo as a development/build tool without deleting those projects.

## 2. Add Expo to the existing project

Install the Expo package, then use the Expo CLI to install SDK-compatible native modules instead of choosing arbitrary package versions:

```bash
npm install expo
npx expo install expo-dev-client expo-router expo-status-bar react-native-safe-area-context
```

For individual native packages, install them through Expo:

```bash
npx expo install expo-dev-client expo-router expo-sqlite expo-localization
```

Keep React and React Native versions compatible with the selected Expo SDK. Use the matching versioned Expo documentation and `npx expo install --check` to verify versions.

## 3. Configure the app entry and routes

For this project, `package.json` uses:

```json
{
  "main": "expo-router/entry"
}
```

Expo Router discovers screens under `src/app/`. The route at `src/app/index.js` re-exports the main screen from `src/app/app.js`, making that screen the `/` route. Keep route files in the configured Router directory; files outside it are not automatically routes.

If a project is not using Expo Router, register its root component with Expo's `registerRootComponent` as described in the Expo documentation instead.

## 4. Add and configure Expo modules

Add the Expo config plugin for any package that requires native configuration. This project's `app.json` configures Expo Router, the splash screen, SQLite, localization, and PostHog. Keep the existing Android and iOS identifiers and native settings when migrating an established app.

After adding or changing native dependencies or app plugins, regenerate native projects only when appropriate for the project:

```bash
npx expo prebuild
```

Prebuild can modify native project files. Review the diff before accepting it, especially when the project contains custom native code. This project retains its native folders and builds them with `expo run`.

## 5. Run the app locally

Install dependencies and start the Expo development server:

```bash
npm install
npx expo start
```

Build and run native development apps with:

```bash
npm run android
npm run ios
```

These scripts use `expo run:android` and `expo run:ios`. They compile the native project and require an available Android emulator/device or iOS simulator/device. A development client is useful when the app depends on native modules that are not included in Expo Go.

## 6. Configure cloud builds (optional)

Use EAS Build for Android and iOS binaries. A minimal `eas.json` can define development, preview, and production profiles:

```bash
npx eas-cli build:configure
npx eas-cli build --platform android --profile development
npx eas-cli build --platform ios --profile development
```

Web is not a valid EAS Build platform. Export or build web assets with the web workflow instead; see [Expo web with Vite](../expo-web-with-vite/README.md).

## 7. Validate the migration

Run the checks that cover the project's targets:

```bash
npx expo install --check
npm run lint
npx tsc --noEmit
npm run build:web
```

For Android, `npm run android` should compile the APK and install it on the selected device. If Gradle reports that a cache lock is held, check for another active build first. If the owning Gradle daemon is idle, stop Gradle cleanly from the `android` directory and retry:

```bash
cd android
./gradlew --status
./gradlew --stop
cd ..
npm run android
```

Do not delete lock files while a Gradle process may still own them.

## Migration checklist

- [ ] Expo SDK and React Native versions are compatible.
- [ ] Native packages are installed with `npx expo install`.
- [ ] App config includes the required Expo plugins and preserves app identifiers.
- [ ] The chosen app entry and Router route structure match `package.json`.
- [ ] Android and iOS development builds run on a device or simulator.
- [ ] Lint, type-check, and target-platform builds pass.
- [ ] Native project changes from prebuild are reviewed.

## References

- [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/)
- [Expo bare workflow](https://docs.expo.dev/bare/overview/)
- [Expo Router](https://docs.expo.dev/versions/v57.0.0/sdk/router/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
