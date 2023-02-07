import { generateCodeOfCondition } from '../generateBackstageCode/generateCodeOfCondition';
import type { Context, Declarations } from '..';
import { NodeAST } from '@/backend/types/frontstage';
import {
  generateCodeOfScrollList,
  generateCodeOfBlockContainer,
  generateCodeOfInlineContainer,
  generateCodeOfFlexContainer,
  generateCodeOfGridContainer,
  generateCodeOfImage,
  generateCodeOfText,
  generateCodeOfParagraph,
} from './plugins';

export const generateCodeByNodeAST = (
  context: Context,
  nodeAST: NodeAST,
  declarations: Declarations,
  children?: string,
): { declaration: string; call: string; name: string } => {
  const { id, type, condition } = nodeAST;

  let output = {
    canHoist: true,
    componentName: '',
    componentDeclaration: '',
    componentElement: '',
    componentCall: '',
  };

  switch (type) {
    case 'ScrollList':
      output = generateCodeOfScrollList(
        nodeAST,
        id,
        children,
        declarations,
        context,
      );
      break;
    case 'BlockContainer':
      output = generateCodeOfBlockContainer(nodeAST, id, children, context);
      break;
    case 'InlineContainer':
      output = generateCodeOfInlineContainer(nodeAST, id, children, context);
      break;
    case 'FlexContainer':
      output = generateCodeOfFlexContainer(nodeAST, id, children, context);
      break;
    case 'GridContainer':
      output = generateCodeOfGridContainer(
        nodeAST,
        id,
        children,
        declarations,
        context,
      );
      break;
    case 'Image':
      output = generateCodeOfImage(nodeAST, id, context);
      break;
    case 'Text':
      output = generateCodeOfText(nodeAST, id, context);
      break;
    case 'Paragraph':
      output = generateCodeOfParagraph(nodeAST, id, declarations, context);
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
