const path = require('path');

const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  addPostcssPlugins,
  addWebpackResolve,
} = require('customize-cra');
module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    addWebpackAlias({
      api: path.resolve(__dirname, './src/api'),
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
      router: path.resolve(__dirname, './src/router'),
      assets: path.resolve(__dirname, './src/assets'),
      images: path.resolve(__dirname, './src/assets/images'),
      styles: path.resolve(__dirname, './src/assets/styles'),
      utils: path.resolve(__dirname, './src/shared/utils'),
      hooks: path.resolve(__dirname, './src/shared/hooks'),
    }),
    addWebpackResolve({
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.wasm', '.css', '.less', '.sass', '.scss', '.styl'],
    }),
    addPostcssPlugins([require('tailwindcss'), require('autoprefixer')]),
  ),
};
