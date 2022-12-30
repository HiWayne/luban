import { NodeAST } from '../../types/frontstage';
import { generateCodeOfCondition } from '../generateBackstageCode/generateCodeOfCondition';
import { generateCodeOfBlockContainer } from './generateCodeOfBlockContainer';
import { generateCodeOfScrollList } from './generateCodeOfScrollList';
import type { Context, Declarations } from '..';
import { generateCodeOfImage } from './generateCodeOfImage';

export const generateCodeByNodeAST = (
  id: number,
  context: Context,
  nodeAST: NodeAST,
  declarations: Declarations,
  children?: string,
): { declaration: string; call: string; name: string } => {
  const { type, condition } = nodeAST;

  let output = {
    canHoist: true,
    componentName: '',
    componentDeclaration: '',
    componentElement: '',
    componentCall: '',
  };

  switch (type) {
    case 'ScrollList':
      output = generateCodeOfScrollList(nodeAST);
      break;
    case 'BlockContainer':
      output = generateCodeOfBlockContainer(nodeAST);
      break;
    case 'Image':
      output = generateCodeOfImage(nodeAST);
      break;
    default:
      break;
  }

  if (condition) {
    return {
      declaration: output.componentDeclaration,
      call:
        generateCodeOfCondition(output.componentCall, condition) ||
        (output.canHoist
          ? children
            ? generateCodeOfCondition(
                `<${output.componentName}>${children}</${output.componentName}>`,
                condition,
              )
            : generateCodeOfCondition(`<${output.componentName} />`, condition)
          : generateCodeOfCondition(
              output.componentElement.replace(/>({\s*children\s*})<\//, () => {
                return `>${children || ''}</`;
              }),
              condition,
            )),

      name: output.componentName,
    };
  } else {
    return {
      declaration: output.componentDeclaration,
      call:
        output.componentCall ||
        (output.canHoist
          ? children
            ? `<${output.componentName}>${children}</${output.componentName}>`
            : `<${output.componentName} />`
          : output.componentElement.replace(
              />\n*{\s*children\s*}\n*<\//,
              () => {
                return `>${children || ''}</`;
              },
            )),
      name: output.componentName,
    };
  }
};
