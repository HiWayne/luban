import { NodeAST, TitleProps } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, isVariableName } from '../utils';
import { generateCodeOfProp } from '../generateCodeOfProp';

export const generateCodeOfTitle = (nodeAST: NodeAST, id: number) => {
  const { props } = nodeAST;
  const {
    text,
    level,
    copyable,
    delete: deleteProp,
    disabled,
    ellipsis,
    keyboard,
    mark,
    strong,
    italic,
    type,
    underline,
    size,
    color,
  } = props as TitleProps;

  const textStyle = (() => {
    const style: any = {};
    if (!size && !color) {
      return undefined;
    } else {
      if (size) {
        style.fontSize = `${size}px`;
      }
      if (color) {
        style.color = color;
      }
      return style;
    }
  })();

  const componentName = `Title_${id}`;

  const componentElement = `<Typography.Title${generateCodeOfProp(
    'style',
    textStyle,
  )}${generateCodeOfProp('level', level)}${generateCodeOfProp(
    'copyable',
    copyable,
  )}${generateCodeOfProp('delete', deleteProp)}${generateCodeOfProp(
    'disable',
    disabled,
  )}${generateCodeOfProp('ellipsis', ellipsis)}${generateCodeOfProp(
    'keyboard',
    keyboard,
  )}${generateCodeOfProp('mark', mark)}${generateCodeOfProp(
    'strong',
    strong,
  )}${generateCodeOfProp('italic', italic)}${generateCodeOfProp(
    'type',
    type,
  )}${generateCodeOfProp('underline', underline)}>${
    isVariableName(text) ? `{${text}}` : text
  }</Typography.Title>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
