import { EsAst } from '@/backend/types/backstage';
import { generateCodeOfVariableDeclaration } from './generateCodeOfVariableDeclaration';

export const generateCodeByEsAST = (ast: EsAst) => {
  if (ast?.body?.length > 0) {
    return ast.body.reduce((bodyCode, body) => {
      switch (body.type) {
        case 'VariableDeclaration':
          return `${bodyCode}${generateCodeOfVariableDeclaration(body)}
`;
        default:
          return bodyCode;
      }
    }, '');
  } else {
    return '';
  }
};
