const path = require('path');

const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  addPostcssPlugins,
  addWebpackResolve,
  removeModuleScopePlugin,
  babelInclude,
} = require('customize-cra');
module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    addWebpackAlias({
      api: path.resolve(__dirname, './src/api'),
      '@core/components': path.resolve(__dirname, '../core/src/components'),
      '@creation/components': path.resolve(__dirname, './src/components'),
      '@core/baseComponents': path.resolve(__dirname, '../core/src/render/baseComponents'),
      pages: path.resolve(__dirname, './src/pages'),
      '@creation/router': path.resolve(__dirname, './src/router'),
      assets: path.resolve(__dirname, './src/assets'),
      '@core/images': path.resolve(__dirname, '../core/src/assets/images'),
      '@creation/images': path.resolve(__dirname, './src/assets/images'),
      styles: path.resolve(__dirname, './src/assets/styles'),
      '@core/utils': path.resolve(__dirname, '../core/src/shared/utils'),
      '@creation/utils': path.resolve(__dirname, './src/shared/utils'),
      '@creation/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@core/hooks': path.resolve(__dirname, '../core/src/shared/hooks'),
      '@core/types': path.resolve(__dirname, '../core/src/types'),
      '@core/styles': path.resolve(__dirname, '../core/src/shared/styles'),
    }),
    addWebpackResolve({
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.wasm', '.css', '.less', '.sass', '.scss', '.styl'],
    }),
    addPostcssPlugins([require('tailwindcss'), require('autoprefixer')]),
    removeModuleScopePlugin(),
    babelInclude([
      path.resolve('src'),
      path.resolve('../core/src'), // (2)
    ]),
  ),
};
