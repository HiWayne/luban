import { ImageGroupProps, NodeAST } from '@/backend/types/backstage';
import { createGenerateCodeFnReturn, isVariableName } from '../utils';
import { generateCodeOfProp } from '../generateCodeCommon/generateCodeOfProp';
import { generateCodeOfScript } from './generateCodeOfScript';

export const generateCodeOfImageGroup = (nodeAST: NodeAST) => {
  const componentName = `ImageGroup`;
  try {
    const { props } = nodeAST;

    if (props) {
      const { images, width, height, objectFit } = props as ImageGroupProps;

      // 包裹Col组件
      const wrapCol = (code: string, key: string) =>
        `<Col key={${key}} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} span={${
          isVariableName(images)
            ? `${images}.length > 4 || ${images}.length === 3 ? 8 : ${images}.length === 1 ? 24 : 12`
            : images.length > 4 || images.length === 3
            ? 8
            : images.length === 1
            ? 24
            : 12
        }}>${code}</Col>`;

      const imageGroupChildrenReactElements = `{${
        isVariableName(images)
          ? `${images}.map(imageSrc => ${wrapCol(
              `<Image style={{ objectFit: "${
                objectFit || 'cover'
              }"}} src={imageSrc}${generateCodeOfProp(
                'width',
                width,
              )}${generateCodeOfProp('height', height)} />`,
              'imageSrc',
            )})`
          : `${(images as string[]).reduce(
              (imagesCode, image) =>
                `${imagesCode}${wrapCol(
                  `<Image style={{ objectFit: "${
                    objectFit || 'cover'
                  }"}} src="${image}"${generateCodeOfProp(
                    'width',
                    width,
                  )}${generateCodeOfProp('height', height)} />`,
                  image,
                )}`,
              '',
            )}`
      }}`;

      // Grid布局
      const componentDeclaration = `const ImageGroup = ({ children }) => (<Image.PreviewGroup><Row>{children}</Row></Image.PreviewGroup>);`;
      const componentCall = `<ImageGroup>${imageGroupChildrenReactElements}</ImageGroup>`;
      return createGenerateCodeFnReturn({
        componentName,
        componentDeclaration,
        componentCall,
      });
    } else {
      const componentElement = `${generateCodeOfScript(
        `console.warn("content of Image.PreviewGroup(id: ${nodeAST.id}) is empty")`,
      )}`;
      return createGenerateCodeFnReturn({ componentName, componentElement });
    }
  } catch (e) {
    const componentElement = `${generateCodeOfScript(
      `console.error("Image.PreviewGroup occurred error: ${e}")`,
    )}`;
    return createGenerateCodeFnReturn({ componentName, componentElement });
  }
};
