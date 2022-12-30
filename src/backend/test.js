const swc = require('@swc/core');

swc
  .transform('export const a = () => {}', {
    swcrc: false,
    jsc: {
      parser: {
        syntax: 'ecmascript',
        jsx: true,
      },
    },
    module: {
      type: 'commonjs',
    },
  })
  .then(({ code }) => {
    console.log(code);
  });
