import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: fileURLToPath(new URL('./vite-web/', import.meta.url)),
  envDir: projectRoot,
  envPrefix: ['VITE_', 'EXPO_PUBLIC_'],
  esbuild: {
    loader: 'jsx',
    include: /(?:\/src\/.*\.js|\/vite-web\/.*\.jsx)$/,
    exclude: /\/node_modules\//,
  },
  plugins: [
    react({
      include: /\.[jt]sx?$/,
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: fileURLToPath(new URL('./node_modules/react-native-web', import.meta.url)),
      },
      {
        find: /^react-native-safe-area-context$/,
        replacement: fileURLToPath(new URL('./vite-web/src/safe-area-context.js', import.meta.url)),
      },
      {
        find: /^react-native-reanimated$/,
        replacement: fileURLToPath(new URL('./vite-web/src/reanimated.js', import.meta.url)),
      },
    ],
    dedupe: ['react', 'react-dom'],
    extensions: [
      '.web.mjs',
      '.mjs',
      '.web.js',
      '.js',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.json',
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: [
        '.web.mjs',
        '.mjs',
        '.web.js',
        '.js',
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
        '.web.jsx',
        '.jsx',
        '.json',
      ],
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    outDir: fileURLToPath(new URL('./dist-vite/', import.meta.url)),
    emptyOutDir: true,
  },
});
