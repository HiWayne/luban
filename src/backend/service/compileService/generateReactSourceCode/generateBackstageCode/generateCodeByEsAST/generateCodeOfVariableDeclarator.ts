import { VariableDeclarator } from '@/backend/types/backstage';
import { generateCodeOfArrayPattern } from './generateCodeOfArrayPattern';
import { generateCodeOfObjectPattern } from './generateCodeOfObjectPattern';
import { generateCodeOfLiteral } from './generateCodeOfLiteral';
import { generateCodeOfIdentifier } from './generateCodeOfIdentifier';
import { generateCodeOfObjectExpression } from './generateCodeOfObjectExpression';
import { generateCodeOfCallExpression } from './generateCodeOfCallExpression';
import { generateCodeOfArrayExpression } from './generateCodeOfArrayExpression';

export const generateCodeOfVariableDeclarator = (
  variableDeclarator: VariableDeclarator,
) => {
  let variableDeclaratorId = '';
  let variableDeclaratorInit = '';

  switch (variableDeclarator.id.type) {
    case 'Identifier':
      variableDeclaratorId = variableDeclarator.id.name;
      break;
    case 'ArrayPattern':
      variableDeclaratorId = generateCodeOfArrayPattern(variableDeclarator.id);
      break;
    case 'ObjectPattern':
      variableDeclaratorId = generateCodeOfObjectPattern(variableDeclarator.id);
      break;
    default:
      break;
  }

  switch (variableDeclarator.init.type) {
    case 'Literal':
      variableDeclaratorInit = generateCodeOfLiteral(variableDeclarator.init);
      break;
    case 'Identifier':
      variableDeclaratorInit = generateCodeOfIdentifier(
        variableDeclarator.init,
      );
      break;
    case 'ArrayExpression':
      variableDeclaratorInit = generateCodeOfArrayExpression(
        variableDeclarator.init,
      );
      break;
    case 'ObjectExpression':
      variableDeclaratorInit = generateCodeOfObjectExpression(
        variableDeclarator.init,
      );
      break;
    case 'CallExpression':
      variableDeclaratorInit = generateCodeOfCallExpression(
        variableDeclarator.init,
      );
      break;
    default:
      break;
  }

  return `${variableDeclaratorId}=${variableDeclaratorInit}`;
};
