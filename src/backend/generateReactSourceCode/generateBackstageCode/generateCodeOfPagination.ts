import { Pagination } from '@/backend/types/backstage';
import { generateCodeOfAction } from './generateCodeOfAction';
import { generateCodeOfProp } from '../generateCodeOfProp';
import { createGenerateCodeFnReturn } from '../utils';

export const generateCodeOfPagination = (pagination: Pagination) => {
  const {
    current,
    setCurrent,
    pageSize,
    hideOnSinglePage,
    showQuickJumper,
    showSizeChanger,
    simple,
    size,
    total,
    action,
  } = pagination;

  const onChangeCode = {
    _builtInType: 'function',
    code: `async (page, pageSize) => {${setCurrent}(page);${generateCodeOfAction(
      action,
    )}}`,
  };

  const componentName = 'PaginationOfTable';

  const componentDeclaration = `
  // paginationProps: current, pageSize, hideOnSinglePage, showQuickJumper, showSizeChanger, simple, size, total, onChange
  const PaginationOfTable = ({ ...paginationProps }) => (<Pagination style={{ margin: '20px 0' }} {...paginationProps} />);
  `;

  const componentCall = `<PaginationOfTable${generateCodeOfProp(
    'current',
    current,
  )}${generateCodeOfProp('pageSize', pageSize)}${generateCodeOfProp(
    'hideOnSinglePage',
    hideOnSinglePage,
  )}${generateCodeOfProp(
    'showQuickJumper',
    showQuickJumper,
  )}${generateCodeOfProp(
    'showSizeChanger',
    showSizeChanger,
  )}${generateCodeOfProp('simple', simple)}${generateCodeOfProp(
    'size',
    size,
  )}${generateCodeOfProp('total', total)}${generateCodeOfProp(
    'onChange',
    onChangeCode,
  )} />`;

  return createGenerateCodeFnReturn({
    componentName,
    componentDeclaration,
    componentCall,
  });
};
