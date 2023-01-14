import { ArrayExpression } from '../../../types/esAst';
import { generateCodeOfLiteral } from './generateCodeOfLiteral';
import { generateCodeOfIdentifier } from './generateCodeOfIdentifier';
import { generateCodeOfObjectExpression } from './generateCodeOfObjectExpression';
import { generateCodeOfCallExpression } from './generateCodeOfCallExpression';

export const generateCodeOfArrayExpression = (
  arrayExpression: ArrayExpression,
) => {
  return `[${arrayExpression.elements.reduce((elementsCode, element, index) => {
    const isFirst = index === 0;
    let elementCode = '';
    switch (element.type) {
      case 'Literal':
        elementCode = generateCodeOfLiteral(element);
        break;
      case 'Identifier':
        elementCode = generateCodeOfIdentifier(element);
        break;
      case 'ArrayExpression':
        elementCode = generateCodeOfArrayExpression(element);
        break;
      case 'ObjectExpression':
        elementCode = generateCodeOfObjectExpression(element);
        break;
      case 'CallExpression':
        elementCode = generateCodeOfCallExpression(element);
        break;
      default:
        break;
    }
    return (
      elementsCode +
      (isFirst || !elementCode ? elementCode : `,${elementCode}`)
    );
  }, '')}]`;
};
