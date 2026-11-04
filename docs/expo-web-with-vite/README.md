# Using Vite for the Expo app's web build

This project shares its React Native screen with a separate Vite web entry. Vite resolves React Native components through React Native Web and uses small web-only shims for safe areas and Reanimated.

## Prerequisites

Install the project dependencies:

```bash
npm install
```

The Vite setup depends on `vite`, `@vitejs/plugin-react`, `react-dom`, and `react-native-web`. Native app dependencies such as `react-native-svg` and `lucide-react-native` are also used by the shared screen.

## Run the web app locally

Start Vite:

```bash
npm run web
```

Open the URL Vite prints in the terminal (normally `http://localhost:5173`). Vite's entry point is `vite-web/index.html`, which mounts the shared screen from `src/app/app.js`.

The Vite build uses `vite.config.mjs` to:

- Resolve `react-native` to `react-native-web`.
- Prefer `.web.js` and other web-specific module extensions.
- Transform JSX contained in the shared `.js` files.
- Use web-only shims from `vite-web/src/` for safe-area context and Reanimated.
- Load `.env.local` values with the `EXPO_PUBLIC_` prefix as well as `VITE_` variables.

Only expose values intended for browsers. Anything included in a web bundle is public; do not put server secrets, private API keys, or deployment credentials in `EXPO_PUBLIC_` or `VITE_` variables.

## Responsive layout

The shared screen reads viewport width with React Native's `useWindowDimensions`. Driver cards use one column on narrow screens, two columns at medium widths, and three columns on wide screens. Content is centered and capped in width on large viewports. Test the interface at phone, tablet, and desktop sizes and check for horizontal overflow.

## Create and preview a production build

Build static web assets:

```bash
npm run build:web
```

The output is written to `dist-vite/` and is ignored by Git. Preview it locally with:

```bash
npx vite preview --config vite.config.mjs
```

Deploy the contents of `dist-vite/` to a static hosting provider. Configure the host to serve `index.html` for the root page. If client-side routes are added to the Vite app, configure SPA fallback rewrites for those routes too.

## Keep Expo's web workflow available

Vite is a separate web build path; it does not replace Expo Router or Expo CLI. The Expo-based web server and static exporter remain available:

```bash
npm run web:expo
npm run build:web:expo
```

`npm run build:web:expo` exports Expo Router's static web output to `dist/`. EAS Build targets native platforms, not `web`.

## Web compatibility notes

- Prefer React Native primitives and libraries that explicitly support web when sharing UI with native.
- Check dependencies that import native-only APIs; provide a `.web.js` implementation or a web-specific Vite alias when necessary.
- The web Reanimated shim intentionally makes the route-map dashed-line animation static. Native builds continue to use Reanimated.
- The web safe-area shim uses browser layout and does not apply device-specific native insets.
- Validate both Vite and Expo web exports after changing shared screens or dependencies.

## Verification commands

```bash
npm run lint
npx tsc --noEmit
npm run build:web
npm run build:web:expo
```

## References

- [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/)
- [Expo web development](https://docs.expo.dev/workflow/web/)
- [Publish Expo websites](https://docs.expo.dev/guides/publishing-websites/)
- [Vite guide](https://vite.dev/guide/)
