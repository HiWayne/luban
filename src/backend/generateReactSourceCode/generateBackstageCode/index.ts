import { Context, Declarations } from '..';
import { NodeAST } from '../../types/backstage';
import { generateCodeOfAvatar } from './generateCodeOfAvatar';
import { generateCodeOfBlockContainer } from './generateCodeOfBlockContainer';
import { generateCodeOfButton } from './generateCodeOfButton';
import { generateCodeOfCheckboxGroupWithLabel } from './generateCodeOfCheckboxGroupWithLabel';
import { generateCodeOfCondition } from './generateCodeOfCondition';
import { generateCodeOfForm } from './generateCodeOfForm';
import { generateCodeOfGrid } from './generateCodeOfGrid';
import { generateCodeOfImage } from './generateCodeOfImage';
import { generateCodeOfImageGroup } from './generateCodeOfImageGroup';
import { generateCodeOfInlineContainer } from './generateCodeOfInlineContainer';
import { generateCodeOfInputWithLabel } from './generateCodeOfInputWithLabel';
import { generateCodeOfList } from './generateCodeOfList';
import { generateCodeOfModal } from './generateCodeOfModal';
import { generateCodeOfParagraph } from './generateCodeOfParagraph';
import { generateCodeOfRadioGroupWithLabel } from './generateCodeOfRadioGroupWithLabel';
import { generateCodeOfRangePickerWithLabel } from './generateCodeOfRangePickerWithLabel';
import { generateCodeOfSelectWithLabel } from './generateCodeOfSelectWithLabel';
import { generateCodeOfSpace } from './generateCodeOfSpace';
import { generateCodeOfTable } from './generateCodeOfTable';
import { generateCodeOfText } from './generateCodeOfText';
import { generateCodeOfTitle } from './generateCodeOfTitle';

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
    case 'BlockContainer':
      output = generateCodeOfBlockContainer(nodeAST, id);
      break;
    case 'InlineContainer':
      output = generateCodeOfInlineContainer(nodeAST, id);
      break;
    case 'Form':
      output = generateCodeOfForm(nodeAST, id);
      break;
    case 'InputWithLabel':
      output = generateCodeOfInputWithLabel(nodeAST);
      break;
    case 'SelectWithLabel':
      output = generateCodeOfSelectWithLabel(nodeAST);
      break;
    case 'RadioGroupWithLabel':
      output = generateCodeOfRadioGroupWithLabel(nodeAST);
      break;
    case 'CheckboxGroupWithLabel':
      output = generateCodeOfCheckboxGroupWithLabel(nodeAST);
      break;
    case 'RangePickerWithLabel':
      output = generateCodeOfRangePickerWithLabel(nodeAST);
      break;
    case 'Table':
      output = generateCodeOfTable(nodeAST, declarations, context);
      break;
    case 'Button':
      output = generateCodeOfButton(nodeAST, id);
      break;
    case 'Image':
      output = generateCodeOfImage(nodeAST, id);
      break;
    case 'ImageGroup':
      output = generateCodeOfImageGroup(nodeAST);
      break;
    case 'Grid':
      output = generateCodeOfGrid(nodeAST, id, declarations, context);
      break;
    case 'Avatar':
      output = generateCodeOfAvatar(nodeAST, id);
      break;
    case 'Text':
      output = generateCodeOfText(nodeAST, id);
      break;
    case 'Title':
      output = generateCodeOfTitle(nodeAST, id);
      break;
    case 'Paragraph':
      output = generateCodeOfParagraph(nodeAST, id);
      break;
    case 'Space':
      output = generateCodeOfSpace(nodeAST, id, declarations, context);
      break;
    case 'Modal':
      output = generateCodeOfModal(nodeAST, id, declarations, context);
      break;
    case 'List':
      output = generateCodeOfList(nodeAST, id, declarations, context);
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

export * from './generateCodeOfReactLogics';
export * from './generateCodeByEsAST';
