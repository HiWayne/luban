import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { posix } from 'path';

const resolve = (relativePath: string) =>
  posix.join(posix.resolve('./'), relativePath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      pages: resolve('src/frontend/pages'),
      router: resolve('src/frontend/router'),
      '@': resolve('src'),
      assets: resolve('src/frontend/assets'),
      lib: resolve('lib'),
      components: resolve('src/frontend/components'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
