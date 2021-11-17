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
      parse: path.resolve(__dirname, './src/parse'),
      render: path.resolve(__dirname, './src/render'),
      components: path.resolve(__dirname, './src/components'),
      baseComponents: path.resolve(__dirname, './src/render/baseComponents'),
      types: path.resolve(__dirname, './src/types'),
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
