import { defineConfig, Plugin_2 } from 'vite';
import react from '@vitejs/plugin-react';
import path, { posix } from 'path';
import fs from 'fs';

const resolve = (relativePath: string) =>
  posix.join(posix.resolve('./'), relativePath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactVirtualized()],
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

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

function reactVirtualized(): Plugin_2 {
  return {
    name: 'flat:react-virtualized',
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved() {
      const file = require
        .resolve('react-virtualized')
        .replace(
          path.join('dist', 'commonjs', 'index.js'),
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
        );
      const code = fs.readFileSync(file, 'utf-8');
      const modified = code.replace(WRONG_CODE, '');
      fs.writeFileSync(file, modified);
    },
  };
}
