import { defineConfig } from 'vite';
import type { Plugin_2 } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path, { posix } from 'path';
import fs from 'fs';

const resolve = (relativePath: string) =>
  posix.join(posix.resolve('./'), relativePath);

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

const reactVirtualized = (): Plugin_2 => {
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
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactVirtualized(),
    svgr({
      // Set it to `true` to export React component as default.
      // Notice that it will overrides the default behavior of Vite.
      exportAsDefault: false,
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        typescript: true,
      },
      // esbuild options, to transform jsx to js
      esbuildOptions: {
        // ...
        loader: 'tsx',
      },
      //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include. By default all svg files will be included.
      include: '**/*.svg',
      //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
      exclude: '',
    }),
  ],
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
    proxy: {
      '/api/': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
