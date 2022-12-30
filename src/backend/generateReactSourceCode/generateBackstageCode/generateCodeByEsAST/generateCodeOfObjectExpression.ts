import { ObjectExpression } from '@/backend/types/backstage';
import { generateCodeOfIdentifier } from './generateCodeOfIdentifier';
import { generateCodeOfLiteral } from './generateCodeOfLiteral';
import { generateCodeOfCallExpression } from './generateCodeOfCallExpression';
import { generateCodeOfArrayExpression } from './generateCodeOfArrayExpression';

export const generateCodeOfObjectExpression = (
  objectExpression: ObjectExpression,
) => {
  return `{ ${objectExpression.properties.reduce(
    (propertiesCode, property, index) => {
      const isFirst = index === 0;
      if (!property.method && !property.shorthand && !property.computed) {
        let propertyCode = isFirst
          ? `${property.key.name}: `
          : `,${property.key.name}: `;
        switch (property.value.type) {
          case 'Literal':
            propertyCode += generateCodeOfLiteral(property.value);
            break;
          case 'Identifier':
            propertyCode += generateCodeOfIdentifier(property.value);
            break;
          case 'ArrayExpression':
            propertyCode += generateCodeOfArrayExpression(property.value);
            break;
          case 'ObjectExpression':
            propertyCode += generateCodeOfObjectExpression(property.value);
            break;
          case 'CallExpression':
            propertyCode += generateCodeOfCallExpression(property.value);
            break;
          default:
            break;
        }
        return propertiesCode + propertyCode;
      } else if (property.shorthand) {
        return (
          propertiesCode +
          (isFirst ? property.key.name : `,${property.key.name}`)
        );
      } else {
        return propertiesCode;
      }
    },
    '',
  )} }`;
};
