import { VariableDeclaration } from '@/backend/types/backstage';
import { generateCodeOfVariableDeclarator } from './generateCodeOfVariableDeclarator';

export const generateCodeOfVariableDeclaration = (
  variableDeclaration: VariableDeclaration,
) => {
  const single = variableDeclaration.declarations.length === 1;
  return single
    ? `const ${generateCodeOfVariableDeclarator(
        variableDeclaration.declarations[0],
      )};`
    : variableDeclaration.declarations.reduce(
        (declarationsCode, declaration, index) => {
          const isFirst = index === 0;
          const isLast = index === variableDeclaration.declarations.length - 1;
          return (
            declarationsCode +
            (isFirst
              ? `let ${generateCodeOfVariableDeclarator(declaration)}`
              : isLast
              ? `,${generateCodeOfVariableDeclarator(declaration)};`
              : `,${generateCodeOfVariableDeclarator(declaration)}`)
          );
        },
        '',
      );
};
