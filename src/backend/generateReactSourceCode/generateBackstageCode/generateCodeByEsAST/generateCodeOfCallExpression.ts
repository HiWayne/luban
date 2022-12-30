import { CallExpression } from '@/backend/types/backstage';
import { generateCodeOfIdentifier } from './generateCodeOfIdentifier';
import { generateCodeOfLiteral } from './generateCodeOfLiteral';
import { generateCodeOfObjectExpression } from './generateCodeOfObjectExpression';
import { generateCodeOfArrayExpression } from './generateCodeOfArrayExpression';

export const generateCodeOfCallExpression = (
  callExpression: CallExpression,
) => {
  return `${callExpression.callee.name}(${callExpression.arguments.reduce(
    (argumentsCode, argument, index) => {
      const isFirst = index === 0;
      let argumentCode = '';
      switch (argument.type) {
        case 'Literal':
          argumentCode = generateCodeOfLiteral(argument);
          break;
        case 'Identifier':
          argumentCode = generateCodeOfIdentifier(argument);
          break;
        case 'ArrayExpression':
          argumentCode = generateCodeOfArrayExpression(argument);
          break;
        case 'ObjectExpression':
          argumentCode = generateCodeOfObjectExpression(argument);
          break;
        case 'CallExpression':
          argumentCode = generateCodeOfCallExpression(argument);
          break;
        default:
          break;
      }
      return (
        argumentsCode +
        (isFirst || !argumentCode ? argumentCode : `,${argumentCode}`)
      );
    },
    '',
  )})`;
};
