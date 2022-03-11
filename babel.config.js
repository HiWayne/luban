process.env.NODE_ENV = 'development';

const getClientEnvironment = require('react-scripts/config/env');
const paths = require('react-scripts/config/paths');

const isEnvDevelopment = true;
const isEnvProduction = false;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM) {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const shouldUseReactRefresh = env.raw.FAST_REFRESH;

module.exports = {
  // presets: [
  //   [
  //     require.resolve('babel-preset-react-app'),
  //     {
  //       runtime: hasJsxRuntime ? 'automatic' : 'classic',
  //     },
  //   ],
  // ],
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript', '@babel/preset-react'],
  plugins: [
    [
      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
          },
        },
      },
    ],
    // isEnvDevelopment && shouldUseReactRefresh && require.resolve('react-refresh/babel'),
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@core/utils': './packages/core/src/shared/utils',
          '@core/baseComponents': './packages/core/src/render/baseComponents',
          '@core/hooks': './packages/core/src/shared/hooks',
          '@core/images': './packages/core/src/assets/images',
          '@core/types': './packages/core/src/types',
          '@core/components': './packages/core/src/components',
          '@creation/images': './packages/creation/src/assets/images',
          '@core/styles': './packages/core/src/shared/styles',
        },
      },
    ],
    // [
    //   'file-loader',
    //   {
    //     name: '[hash].[ext]',
    //     extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
    //     publicPath: '/public',
    //     outputPath: '/public',
    //     context: '',
    //     limit: 20000,
    //   },
    // ],
  ].filter(Boolean),
  compact: isEnvProduction,
};
