import { ImageProps, NodeAST } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, isVariableName } from '../utils';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';

export const generateCodeOfImage = (nodeAST: NodeAST, id: number) => {
  const { props } = nodeAST;
  const { src, width, height, alt, placeholder, preview, objectFit } =
    props as ImageProps;

  const componentName = `Image_${id}`;

  const componentElement = `<Image key=${
    isVariableName(src) ? `{${src}}` : `"${src}"`
  } style={{ objectFit: "${objectFit || 'cover'}" }}${generateCodeOfProp(
    'src',
    src,
  )}${generateCodeOfProp('width', width)}${generateCodeOfProp(
    'height',
    height,
  )}${generateCodeOfProp('alt', alt)}${generateCodeOfProp(
    'placeholder',
    placeholder,
  )}${generateCodeOfProp('preview', preview)} />`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
