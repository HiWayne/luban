import { NodeAST, ButtonProps } from '@/backend/types/backstage';
import { generateCodeOfAction } from './generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfButton = (nodeAST: NodeAST, id: number) => {
  const { props } = nodeAST;
  const {
    text,
    action,
    block,
    danger,
    disabled,
    ghost,
    href,
    htmlType,
    icon,
    loading,
    shape,
    size,
    target,
    type,
    onClick,
  } = props as ButtonProps;

  const onClickCode = {
    _builtInType: 'function',
    code: `async () => {${generateCodeOfAction(action)}}`,
  };

  const componentName = `Button_${id}`;

  const componentElement = `<Button${generateCodeOfProp(
    'block',
    block,
  )}${generateCodeOfProp('danger', danger)}${generateCodeOfProp(
    'disabled',
    disabled,
  )}${generateCodeOfProp('ghost', ghost)}${generateCodeOfProp(
    'href',
    href,
  )}${generateCodeOfProp('htmlType', htmlType)}${generateCodeOfProp(
    'icon',
    icon,
  )}${generateCodeOfProp('loading', loading)}${generateCodeOfProp(
    'shape',
    shape,
  )}${generateCodeOfProp('size', size)}${generateCodeOfProp(
    'target',
    target,
  )}${generateCodeOfProp('type', type)}${generateCodeOfProp(
    'onClick',
    onClick,
  )}${generateCodeOfProp('onClick', onClickCode)}>${text}</Button>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
