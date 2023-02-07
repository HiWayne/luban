import { ImageProps, NodeAST } from '@/backend/types/frontstage';
import {
  createBuiltInTypeCode,
  createGenerateCodeFnReturn,
  createIdAttrInDev,
} from '../utils';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import { Context } from '..';
import { generateCodeOfAction } from '../generateCodeCommon/generateCodeOfAction';
import {
  actionConfig,
  borderRadiusConfig,
  heightConfig,
  layoutConfig,
  marginConfig,
  styleConfig,
  ToCComponent,
  widthConfig,
} from './toCComponentsPluginsConfig';

export const generateCodeOfImage = (
  nodeAST: NodeAST,
  id: number,
  context: Context,
) => {
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
    action,
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

      const ${componentName} = ({ role, id, src, style, onClick }) => {
        return (<BlockImageWrapper_inner_${id} role={role} id={id} style={style} onClick={onClick}><BlockImage_inner_${id} src={src} /></BlockImageWrapper_inner_${id}>)
      };
    `
      : `
      ${InlineImageComponent}

      const ${componentName} = ({ role, id, src, style, onClick }) => {
        return (<InlineImage_inner_${id} role={role} id={id} style={style} src={src} onClick={onClick} />)
      };
    `;

  const onClickCode =
    !context.development && action
      ? createBuiltInTypeCode(
          'function',
          `async () => {${generateCodeOfAction(action)}}`,
        )
      : undefined;

  const componentCall = `<${componentName}${createIdAttrInDev(
    context.development,
    id,
  )}${generateCodeOfProp('key', key)}${generateCodeOfProp(
    'src',
    src,
  )}${generateCodeOfProp('style', style)}${generateCodeOfProp(
    'onClick',
    onClickCode,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};

generateCodeOfImage.plugin = {
  level: 1,
  sort: 5,
  leaf: true,
  emptyTag: true,
  name: '图片',
  type: 'Image',
  description: '图片',
  defaultAST: {
    type: 'Image',
    props: {
      layout: 'inline',
      src: 'https://c-ssl.dtstatic.com/uploads/ops/202301/31/20230131144921_34fb2.png',
      saveable: false,
      objectFit: 'cover',
      objectPosition: 'center',
    },
  },
  configs: [
    {
      name: '图片',
      description: '上传图片或设置变量名',
      required: true,
      propName: 'src',
      formSchema: {
        type: 'image-src',
      },
    },
    { ...layoutConfig, defaultConfig: 'inline' },
    widthConfig,
    heightConfig,
    {
      name: '图片宽/高比例',
      description: '在设置了宽度且不设置高度时，可以通过宽高比例固定图片大小',
      required: false,
      propName: 'ratio',
    },
    borderRadiusConfig,
    {
      name: '是否可保存',
      description: '是否可以长按保存',
      required: false,
      propName: 'saveable',
    },
    marginConfig,
    {
      name: '实际图片自适应大小',
      description:
        '若不设置组件宽高或只设置宽度，实际图片会和组件宽度一致，高度按原始比例撑开组件。若组件宽高都设置，但实际图片宽高比例与组件不一致，图片就会变形。可以通过这个配置来选择图片展示方式。举例："cover"-图片尽可能小的以原始比例填满组件（图片一定能填满组件，但可能显示不完整）、"contain"-图片尽可能大的（但不超出组件）以原始比例完整显示（图片一定能显示完整，但可能填不满组件）。',
      required: false,
      propName: 'objectFit',
    },
    {
      name: '实际图片位置',
      description:
        '若实际图片比例与组件宽高比例不一致，且设置了实际图片自适应大小，图片可能为了保持原始比例而小于组件的大小展示。这时可以设置图片在组件中的位置（默认靠左上）。举例："center"-上下左右居中、"center left"-上下方向居中，左右方向靠左、"top right"-上下方向靠上，左右方向靠右。',
      required: false,
      propName: 'objectPosition',
    },
    actionConfig,
    styleConfig,
  ],
} as ToCComponent;
