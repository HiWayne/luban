import { ImageProps, NodeAST } from '@/backend/types/frontstage';
import { createGenerateCodeFnReturn } from '../utils';
import { generateCodeOfProp } from '../generateCodeOfProp';

export const generateCodeOfImage = (nodeAST: NodeAST) => {
  const { props } = nodeAST;
  const { src, layout, width, height, ratio, borderRadius, saveable, margin } =
    props as ImageProps;

  const componentName = layout === 'block' ? `ImageBlock` : `Image`;

  const marginCss = margin
    ? typeof margin === 'number'
      ? `margin: ${margin}px;`
      : `margin: ${margin};`
    : '';

  const borderRadiusCss = borderRadius
    ? `border-radius: ${
        typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius
      }`
    : '';

  const saveableCss = saveable ? 'user-select: none;' : '';

  const objectCss =
    height || ratio
      ? `
  object-fit: cover;
  object-position: center;
  `
      : '';

  const BlockImageWrapperComponent = `
    const BlockImageWrapper_inner = styled.div\`
        ${marginCss}
        ${borderRadiusCss}
        overflow: hidden;
    \`
  `;

  const BlockImageComponent = `
    const BlockImage_inner = styled.img\`
        display: inline-block;
        width: 100%;
        ${ratio ? `height: ${(100 / ratio).toFixed(1)}%;` : ''}
        ${objectCss}
        ${borderRadiusCss}
        ${saveableCss}
    \`;
  `;

  const InlineImageComponent = `
    const InlineImage_inner = styled.img\`
        ${marginCss}
        display: inline-block;
        ${
          width
            ? `width: ${typeof width === 'number' ? `${width}px` : width};`
            : ''
        }
        ${
          ratio
            ? `height: ${(100 / ratio).toFixed(1)}%;`
            : height
            ? `height: ${typeof height === 'number' ? `${height}px` : height};`
            : ''
        }
        ${objectCss}
        ${borderRadiusCss}
        ${saveableCss}
    \`
  `;

  const componentDeclaration =
    layout === 'block'
      ? `
      ${BlockImageWrapperComponent}
      ${BlockImageComponent}

      const ${componentName} = ({ src }) => {
        return (<BlockImageWrapper_inner><BlockImage_inner src={src} /></BlockImageWrapper_inner>)
      };
    `
      : `
      ${InlineImageComponent}

      const ${componentName} = ({ src }) => {
        return (<InlineImage_inner src={src} />)
      };
    `;

  const componentCall = `<${componentName}${generateCodeOfProp('src', src)} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
