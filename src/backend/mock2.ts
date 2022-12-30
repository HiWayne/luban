import { PageModel } from './types';
import { NodeAST } from './types/frontstage';

export const treeDemo: NodeAST = {
  id: 1,
  type: 'BlockContainer',
  children: [
    {
      id: 2,
      type: 'Image',
      props: {
        layout: 'block',
        src: 'https://c-ssl.duitang.com/uploads/blog/202212/26/20221226144302_4a645.jpeg',
      },
    },
  ],
};

export const pageModel: PageModel = {
  meta: {
    title: '换美图 过圣诞',
    key: 'test1',
    path: '/test1',
    env: ['mobile', 'react', 'mpa'],
    mode: 'development',
  },
  view: treeDemo,
};
