import { getRandomString } from '@/backend/generateReactSourceCode/utils';
import { Meta } from '@/backend/types';

export const normalizePageMeta = (pageMeta: Meta) => {
  const _pageMeta = { ...pageMeta };
  const defaultPageMeta: Partial<Meta> = {
    icon: '/vite.svg',
    title: '未命名页面',
    path: `/${getRandomString()}`,
  };
  Object.keys(_pageMeta).forEach((key) => {
    if (_pageMeta[key as keyof Meta] === undefined) {
      _pageMeta[key as keyof Meta] = defaultPageMeta[key as keyof Meta] as any;
    } else {
      switch (key) {
        case 'path':
          if (/\/$/.test(_pageMeta.path)) {
            _pageMeta.path = _pageMeta.path.replace(/\/$/, '');
          }
          break;
        default:
          break;
      }
    }
  });

  return _pageMeta;
};
