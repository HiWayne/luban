import { GridProps, NodeAST } from '@/backend/types/backstage';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { generateCodeOfLiteral } from './generateCodeOfLiteral';
import { astToReactNodeCodeOfBackstage, Context, Declarations } from '../index';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfGrid = (
  nodeAST: NodeAST,
  id: number,
  declarations: Declarations,
  context: Context,
) => {
  const { props, children } = nodeAST;

  const { row, column, justify, align, gutter, wrap, items } =
    props as GridProps;

  const componentName = `Grid_${id}`;

  const componentElement = `<Row${generateCodeOfProp(
    'justify',
    justify,
  )}${generateCodeOfProp('align', align)}${generateCodeOfProp(
    'gutter',
    gutter,
  )}${generateCodeOfProp(
    'wrap',
    wrap === true ? 'true' : wrap === false ? 'false' : undefined,
  )}>${new Array(row * column).fill(true).reduce((colsCode, __, colIndex) => {
    const defaultSpan = Number((24 / column).toFixed(2));
    if (items) {
      const {
        flex,
        offset,
        order,
        pull,
        push,
        span = defaultSpan,
        xs,
        sm,
        md,
        lg,
        xl,
        xxl,
      } = items[colIndex] || {};
      return `${colsCode}<Col key={${colIndex}}${generateCodeOfProp(
        'flex',
        flex,
      )}${generateCodeOfProp('offset', offset)}${generateCodeOfProp(
        'order',
        order,
      )}${generateCodeOfProp('pull', pull)}${generateCodeOfProp(
        'push',
        push,
      )}${generateCodeOfProp('span', span)}${generateCodeOfProp(
        'xs',
        typeof xs === 'object' ? generateCodeOfLiteral(xs) : xs,
      )}${generateCodeOfProp(
        'sm',
        typeof sm === 'object' ? generateCodeOfLiteral(sm) : sm,
      )}${generateCodeOfProp(
        'md',
        typeof md === 'object' ? generateCodeOfLiteral(md) : md,
      )}${generateCodeOfProp(
        'lg',
        typeof lg === 'object' ? generateCodeOfLiteral(lg) : lg,
      )}${generateCodeOfProp(
        'xl',
        typeof xl === 'object' ? generateCodeOfLiteral(xl) : xl,
      )}${generateCodeOfProp(
        'xxl',
        typeof xxl === 'object' ? generateCodeOfLiteral(xxl) : xxl,
      )}>${
        astToReactNodeCodeOfBackstage(
          children![colIndex],
          declarations,
          context,
        ).call
      }</Col>`;
    } else {
      return `${colsCode}<Col key={${colIndex}}${generateCodeOfProp(
        'span',
        defaultSpan,
      )}>${
        astToReactNodeCodeOfBackstage(
          children![colIndex],
          declarations,
          context,
        ).call
      }</Col>`;
    }
  }, '')}</Row>`;

  return createGenerateCodeFnReturn({
    componentElement,
    componentName,
    canHoist: false,
  });
};
