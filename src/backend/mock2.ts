import { LogicAST, PageModel } from './types';
import { NodeAST } from './types/frontstage';

export const treeDemo: NodeAST = {
  id: 1,
  type: 'BlockContainer',
  props: {
    style: {
      position: 'relative',
    },
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
      id: 16,
      type: 'BlockContainer',
      props: {
        padding: '74px 8px 71px 8px',
        backgroundColor: 'rgb(213, 52, 45)',
        style: {
          position: 'relative',
        },
      },
      children: [
        {
          id: 14,
          type: 'InlineContainer',
          props: {
            width: 210,
            height: 52,
            borderRadius: 16,
            backgroundColor: '#FFDBAE',
            style: {
              position: 'absolute',
              left: 83,
              top: -29,
            },
          },
          children: [
            {
              id: 15,
              type: 'Text',
              props: {
                text: '圣诞专辑合集',
                fontSize: 26,
                fontFamily: 'AlibabaPuHuiTiH',
                color: '#447741',
                lineHeight: 52,
                width: '100%',
                textAlign: 'center',
              },
            },
          ],
        },
        {
          id: 3,
          type: 'BlockContainer',
          props: {
            padding: '50px 0 22px 2px',
            borderRadius: 16,
            backgroundColor: '#fff',
            style: {
              position: 'relative',
            },
          },
          children: [
            {
              id: 4,
              type: 'ScrollList',
              props: {
                data: 'component_scope_variable_list1',
                renderItem: {
                  iterate_scope_variable: 'item',
                  render: {
                    id: 5,
                    type: 'FlexContainer',
                    props: {
                      layout: 'inline',
                      direction: 'column',
                      justifyContent: 'flex-start',
                      margin: '0 0 0 10px',
                    },
                    children: [
                      {
                        id: 6,
                        type: 'InlineContainer',
                        props: {
                          style: {
                            position: 'relative',
                          },
                        },
                        children: [
                          {
                            id: 7,
                            type: 'Image',
                            props: {
                              src: 'iterate_scope_variable_item.image',
                              width: 136,
                              height: 136,
                              borderRadius: 12,
                            },
                          },
                          {
                            id: 8,
                            type: 'FlexContainer',
                            props: {
                              style: {
                                position: 'absolute',
                                left: 6,
                                bottom: 6,
                              },
                            },
                            children: [
                              {
                                id: 9,
                                type: 'Image',
                                props: {
                                  src: 'https://c-ssl.dtstatic.com/uploads/avatar/202107/14/20210714194901_1453e.thumb.200_200_c.jpg_webp',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                },
                              },
                              {
                                id: 10,
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
                        ],
                      },
                      {
                        id: 11,
                        type: 'Text',
                        props: {
                          text: '&quot;我想，慢慢来是一种诚意&quot;',
                          margin: '8px 0 0 0',
                          width: 136,
                          // ellipsis: true,
                          fontSize: 13,
                          fontWeight: 400,
                          lineHeight: 20,
                          color: '#444444',
                          fontFamily: 'PingFangSC-Regular, PingFang SC',
                        },
                      },
                    ],
                  },
                },
              },
            },
            {
              id: 12,
              type: 'InlineContainer',
              props: {
                width: 237,
                height: 60,
                backgroundImage:
                  'https://c-ssl.dtstatic.com/uploads/ops/202301/05/20230105161819_37458.png',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: false,
                style: {
                  position: 'absolute',
                  top: -34,
                  left: -8,
                },
              },
              children: [
                {
                  id: 13,
                  type: 'Text',
                  props: {
                    margin: '22px 0 0 28px',
                    text: '画师大大圣诞作品合集',
                    fontSize: 15,
                    fontFamily: 'PingFangSC-Semibold, PingFang SC',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    lineHeight: 21,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 17,
      type: 'BlockContainer',
      props: {
        padding: '51px 0 0 0',
        style: {
          position: 'relative',
        },
      },
      children: [
        {
          id: 56,
          type: 'InlineContainer',
          props: {
            width: 210,
            height: 52,
            borderRadius: 16,
            backgroundColor: '#FFDBAE',
            style: {
              position: 'absolute',
              left: 83,
              top: -26,
            },
          },
          children: [
            {
              id: 57,
              type: 'Text',
              props: {
                text: '圣诞图片合集',
                fontSize: 26,
                fontFamily: 'AlibabaPuHuiTiH',
                color: '#447741',
                lineHeight: 52,
                width: '100%',
                textAlign: 'center',
              },
            },
          ],
        },
        {
          id: 18,
          type: 'BlockContainer',
          props: {
            padding: '0 0 0 20px',
          },
          children: [
            {
              id: 19,
              type: 'FlexContainer',
              props: {
                justifyContent: 'space-between',
              },
              children: [
                {
                  id: 20,
                  type: 'FlexContainer',
                  props: {
                    direction: 'column',
                    alignItems: 'flex-start',
                  },
                  children: [
                    {
                      id: 21,
                      type: 'Text',
                      props: {
                        text: '手绘风圣诞情头🎄',
                        fontSize: 16,
                        fontFamily: 'PingFangSC-Semibold, PingFang SC',
                        fontWeight: 600,
                        color: '#444444',
                        lineHeight: 22,
                      },
                    },
                    {
                      id: 22,
                      type: 'Text',
                      props: {
                        text: '手绘风圣诞情头手绘风圣诞不可错过的美图',
                        margin: '8px 0 0 0',
                        fontSize: 12,
                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                        fontWeight: 400,
                        color: '#aaaaaa',
                        lineHeight: 17,
                      },
                    },
                  ],
                },
                {
                  id: 23,
                  type: 'InlineContainer',
                  props: {
                    width: 76,
                    height: 32,
                    borderRadius: 18,
                    backgroundColor: '#FFF5F5',
                  },
                  children: [
                    {
                      id: 24,
                      type: 'Text',
                      props: {
                        text: '查看更多',
                        width: '100%',
                        textAlign: 'center',
                        lineHeight: 32,
                        fontSize: 13,
                        fontFamily: 'PingFangSC-Medium, PingFang SC',
                        fontWeight: 500,
                        color: '#FF5959',
                        action: {
                          type: 'Navigate',
                          data: {
                            url: 'https://www.duitang.com',
                            method: '_blank',
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 25,
              type: 'ScrollList',
              props: {
                wrapperStyle: {
                  margin: '16px 0 0 0',
                },
              },
              children: [
                {
                  id: 26,
                  type: 'GridContainer',
                  props: {
                    columns: 2,
                    space: 2,
                    margin: '0 10px 0 0',
                  },
                  children: [
                    {
                      id: 27,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202301/06/20230106182421_eb8cd.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 28,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231810_183dd.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 29,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231755_80908.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 30,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231801_ccec7.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 31,
                  type: 'GridContainer',
                  props: {
                    columns: 2,
                    space: 2,
                    margin: '0 10px 0 0',
                  },
                  children: [
                    {
                      id: 32,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231809_981c6.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 33,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231810_183dd.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 34,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231755_80908.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 35,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231801_ccec7.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 36,
                  type: 'GridContainer',
                  props: {
                    columns: 2,
                    space: 2,
                    margin: '0 10px 0 0',
                  },
                  children: [
                    {
                      id: 37,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231809_981c6.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 38,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231810_183dd.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 39,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231755_80908.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 40,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231801_ccec7.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 41,
                  type: 'GridContainer',
                  props: {
                    columns: 2,
                    space: 2,
                    margin: '0 10px 0 0',
                  },
                  children: [
                    {
                      id: 42,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231809_981c6.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 43,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231810_183dd.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 44,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231755_80908.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 45,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231801_ccec7.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 46,
                  type: 'GridContainer',
                  props: {
                    columns: 2,
                    space: 2,
                    margin: '0 10px 0 0',
                  },
                  children: [
                    {
                      id: 47,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231809_981c6.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 48,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231810_183dd.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 49,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231755_80908.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 50,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231801_ccec7.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 51,
                  type: 'GridContainer',
                  props: {
                    columns: 2,
                    space: 2,
                    margin: '0 10px 0 0',
                  },
                  children: [
                    {
                      id: 52,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231809_981c6.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 53,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231810_183dd.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 54,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231755_80908.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                    {
                      id: 55,
                      type: 'Image',
                      props: {
                        src: 'https://c-ssl.dtstatic.com/uploads/blog/202209/09/20220909231801_ccec7.thumb.300_300_c.jpeg_webp',
                        width: 100,
                        height: 100,
                        borderRadius: 9,
                        style: {
                          border: '1px solid #E0E0E0',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
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
      { name: 'component_scope_variable_list1' },
      { name: 'component_scope_variable_set_list1' },
    ],
    raw: `const [component_scope_variable_list1, component_scope_variable_set_list1] = useState([{image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164437_472ff.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164438_48d49.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164438_ce941.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164439_b567d.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164440_a8c74.jpeg'}, {image: 'https://c-ssl.duitang.com/uploads/blog/202210/03/20221003164440_e25de.jpeg'}])`,
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
