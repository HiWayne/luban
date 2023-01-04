import { LogicAST, PageModel } from './types';
import { NodeAST } from './types/frontstage';

export const treeDemo: NodeAST = {
  id: 1,
  type: 'BlockContainer',
  props: {
    backgroundColor: 'rgb(213 52 45)',
  },
  children: [
    {
      id: 2,
      type: 'Image',
      props: {
        layout: 'block',
        src: 'https://c-ssl.dtstatic.com/uploads/ops/202301/04/20230104173433_934dc.png',
      },
    },
    {
      id: 3,
      type: 'BlockContainer',
      props: {
        margin: '74px 8px 0 8px',
        padding: '50px 0 22px 2px',
        borderRadius: 16,
        backgroundColor: '#fff',
      },
      children: [
        {
          id: 4,
          type: 'ScrollList',
          props: {
            data: 'component_scope_variable_list',
            renderItem: {
              iterate_scope_variable: 'item',
              render: {
                id: 5,
                type: 'InlineContainer',
                props: {
                  margin: '0 0 0 10px',
                  style: {
                    position: 'relative',
                  },
                },
                children: [
                  {
                    id: 6,
                    type: 'Image',
                    props: {
                      src: 'iterate_scope_variable_item.image',
                      width: 136,
                      height: 136,
                      borderRadius: 12,
                    },
                  },
                  {
                    id: 7,
                    type: 'BlockContainer',
                    props: {
                      style: {
                        position: 'absolute',
                        left: 6,
                        bottom: 6,
                      },
                    },
                    children: [
                      {
                        id: 8,
                        type: 'Image',
                        props: {
                          src: 'https://c-ssl.dtstatic.com/uploads/avatar/202107/14/20210714194901_1453e.thumb.200_200_c.jpg_webp',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                        },
                      },
                      {
                        id: 9,
                        type: 'Text',
                        props: {
                          text: '苏欣欣',
                          margin: '0 0 0 4px',
                          fontSize: 12,
                          fontWeight: 500,
                          color: '#fff',
                          fontFamily: 'PingFangSC-Medium, PingFang SC',
                        },
                      },
                    ],
                  },
                  {
                    id: 10,
                    type: 'Text',
                    props: {
                      text: '&quot;我想，慢慢来是一种诚意&quot;',
                      width: 136,
                      ellipsis: true,
                      fontSize: 13,
                      fontWeight: 400,
                      color: '#444444',
                      fontFamily: 'PingFangSC-Regular, PingFang SC',
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  ],
};

const logicDemo: LogicAST[] = [
  {
    id: 100,
    type: 'state',
    identifiers: [
      { name: 'component_scope_variable_list' },
      { name: 'component_scope_variable_set_list' },
    ],
    raw: `const [component_scope_variable_list, component_scope_variable_set_list] = useState([{image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164437_472ff.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164438_48d49.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164438_ce941.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164439_b567d.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164440_a8c74.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164440_e25de.jpeg'}])`,
  },
];

export const pageModel: PageModel = {
  meta: {
    title: '换美图 过圣诞',
    key: 'test1',
    path: '/test1',
    env: ['mobile', 'react', 'mpa'],
    mode: 'development',
  },
  view: treeDemo,
  logics: logicDemo,
};
