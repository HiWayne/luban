import { NodeAST, TextProps } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, isVariableName } from '../utils';
import { generateCodeOfProp } from '../generateCodeOfProp';

export const generateCodeOfText = (nodeAST: NodeAST, id: number) => {
  const { props } = nodeAST;
  const {
    text,
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
  } = props as TextProps;

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

  const componentName = `Text_${id}`;

  const componentElement = `<Typography.Text${generateCodeOfProp(
    'style',
    textStyle,
  )}${generateCodeOfProp('copyable', copyable)}${generateCodeOfProp(
    'delete',
    deleteProp,
  )}${generateCodeOfProp('disable', disabled)}${generateCodeOfProp(
    'ellipsis',
    ellipsis,
  )}${generateCodeOfProp('keyboard', keyboard)}${generateCodeOfProp(
    'mark',
    mark,
  )}${generateCodeOfProp('strong', strong)}${generateCodeOfProp(
    'italic',
    italic,
  )}${generateCodeOfProp('type', type)}${generateCodeOfProp(
    'underline',
    underline,
  )}>${isVariableName(text) ? `{${text}}` : text}</Typography.Text>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
