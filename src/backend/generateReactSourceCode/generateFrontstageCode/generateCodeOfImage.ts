import { ImageProps, NodeAST } from '@/backend/types/frontstage';
import { createGenerateCodeFnReturn } from '../utils';
import { generateCodeOfProp } from '../generateCodeOfProp';

export const generateCodeOfImage = (nodeAST: NodeAST, id: number) => {
  const { props, key } = nodeAST;
  const {
    src,
    layout,
    width,
    height,
    ratio,
    borderRadius,
    saveable,
    margin,
    objectFit,
    objectPosition,
    style,
  } = props as ImageProps;

  const componentName = layout === 'block' ? `ImageBlock_${id}` : `Image_${id}`;

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
  object-fit: ${objectFit || 'cover'};
  object-position: ${objectPosition || 'center'};
  `
      : `${objectFit ? `object-fit: ${objectFit};` : ''}
      ${objectPosition ? `object-position: ${objectPosition};` : ''}`;

  const BlockImageWrapperComponent = `
    const BlockImageWrapper_inner_${id} = styled.div\`
        ${marginCss}
        ${
          width
            ? `width: ${typeof width === 'number' ? `${width}px` : width};`
            : ''
        }
        ${
          ratio
            ? width
              ? `height: ${(parseFloat(width as string) / ratio).toFixed(1)}px;`
              : ''
            : height
            ? `height: ${typeof height === 'number' ? `${height}px` : height};`
            : ''
        }
        ${borderRadiusCss}
        overflow: hidden;
    \`
  `;

  const BlockImageComponent = `
    const BlockImage_inner_${id} = styled.img\`
        display: inline-block;
        width: 100%;
        ${ratio || height ? 'height: 100%;' : ''}
        ${objectCss}
        ${borderRadiusCss}
        ${saveableCss}
    \`;
  `;

  const InlineImageComponent = `
    const InlineImage_inner_${id} = styled.img\`
        ${marginCss}
        display: inline-block;
        ${
          width
            ? `width: ${typeof width === 'number' ? `${width}px` : width};`
            : ''
        }
        ${
          ratio
            ? `height: ${(parseFloat(width as string) / ratio).toFixed(1)}px;`
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

      const ${componentName} = ({ src, style }) => {
        return (<BlockImageWrapper_inner_${id} style={style}><BlockImage_inner_${id} src={src} /></BlockImageWrapper_inner_${id}>)
      };
    `
      : `
      ${InlineImageComponent}

      const ${componentName} = ({ src, style }) => {
        return (<InlineImage_inner_${id} style={style} src={src} />)
      };
    `;

  const componentCall = `<${componentName}${generateCodeOfProp(
    'key',
    key,
  )}${generateCodeOfProp('src', src)}${generateCodeOfProp('style', style)} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
