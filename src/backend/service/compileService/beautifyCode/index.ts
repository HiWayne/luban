import prettier from 'prettier';

export const beautifyCode = (code: string) => {
  return prettier.format(code, {
    parser: 'babel',
    singleQuote: true,
    jsxBracketSameLine: true,
    printWidth: 80,
    trailingComma: 'all',
  });
};
