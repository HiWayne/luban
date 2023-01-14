import { ModalProps, NodeAST } from '@/backend/types/backstage';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import { astToReactNodeCodeOfBackstage, Context, Declarations } from '../index';
import { createGenerateCodeFnReturn } from '../utils';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';

export const generateCodeOfModal = (
  nodeAST: NodeAST,
  id: number,
  declarations: Declarations,
  context: Context,
) => {
  const { props, children } = nodeAST;

  const {
    open,
    setOpen,
    cancelText,
    okText,
    okType,
    title,
    width,
    okAction,
    cancelAction,
  } = props as ModalProps;

  const okActionCode = {
    _builtInType: 'function',
    code: `() => {${generateCodeOfAction(okAction)}}`,
  };

  const cancelActionCode = {
    _builtInType: 'function',
    code: `() => {${setOpen}(false);${
      cancelAction ? generateCodeOfAction(cancelAction) : ''
    }}`,
  };

  const componentName = `Modal_${id}`;

  const componentElement = `<Modal${generateCodeOfProp(
    'title',
    title,
  )}${generateCodeOfProp('open', open)}${generateCodeOfProp(
    'cancelText',
    cancelText,
  )}${generateCodeOfProp('okText', okText)}${generateCodeOfProp(
    'okType',
    okType,
  )}${generateCodeOfProp('width', width)}${generateCodeOfProp(
    'onOk',
    okActionCode,
  )}${generateCodeOfProp('onCancel', cancelActionCode)}>${
    Array.isArray(children)
      ? children.reduce(
          (childrenCode, child) =>
            `${childrenCode}${
              astToReactNodeCodeOfBackstage(child, declarations, context)
                .call
            }`,
          '',
        )
      : ''
  }</Modal>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
