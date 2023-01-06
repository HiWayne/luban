import { FC } from 'react';
import { NodeAST } from '@/backend/types/frontstage/index';
import toCImageDemo from '../assets/toCImageDemo.svg';

interface FormSchema {
  type: 'input' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'image-upload';
  options: { label: string; value: any }[];
  defaultValue: any;
}

interface Config {
  name: string;
  description: string;
  formSchema?: FormSchema;
  FormComponent?: FC;
  required: boolean;
  propName: string;
}

interface ToCComponent {
  name: string;
  type:
    | 'BlockContainer'
    | 'InlineContainer'
    | 'FlexContainer'
    | 'GridContainer'
    | 'ScrollList'
    | 'Image'
    | 'Text'
    | 'Paragraph';
  description: string;
  defaultAST: NodeAST;
  configs: Config[];
}

const commonContainerConfigs: Config[] = [
  {
    name: '宽度',
    description:
      '容器宽度。默认单位px，也可自定义单位。若容器是块级(block)，宽度默认占满一行。',
    required: false,
    propName: 'width',
  },
  {
    name: '高度',
    description:
      '容器高度。默认单位px，也可自定义单位。若不设置，容器高度将由内部内容撑开。',
    required: false,
    propName: 'height',
  },
  {
    name: '外边距',
    description: '容器边缘与外部内容的边距。默认单位px，也可自定义单位。',
    required: false,
    propName: 'margin',
  },
  {
    name: '内边距',
    description: '容器边缘与内部内容的边距。默认单位px，也可自定义单位。',
    required: false,
    propName: 'padding',
  },
  {
    name: '圆角',
    description:
      '容器四周的圆角。默认单位px，也可自定义单位。举例：8-四周圆角都是8px、"8px 16px 32px 64px"-左上8px，右上16px，右下32px，左下64px。',
    required: false,
    propName: 'borderRadius',
  },
  {
    name: '背景颜色',
    description: '容器背景颜色',
    required: false,
    propName: 'backgroundColor',
  },
  {
    name: '背景图片',
    description: '容器背景图片。',
    required: false,
    propName: 'backgroundImage',
  },
  {
    name: '背景图片位置',
    description:
      '容器背景图片位置。图片的左上角与容器左上的x、y距离。举例："center"-居中、"20px 40px"-图片上边距容器上边20px，左边距容器左边40px、"top center"-图片上边紧靠容器上边，左右居中。',
    required: false,
    propName: 'backgroundPosition',
  },
  {
    name: '背景图片大小',
    description:
      '容器背景图片大小。举例："cover"-图片最小能填满容器背景的大小（图片一定能填满背景，但可能显示不完整）、"contain"-图片最大能完整显示的大小（图片一定能显示完整，但可能填不满容器背景）、"200px"-宽200px，高以图片原始比例自适应、"200px 100px"-宽200px，高100px。',
    required: false,
    propName: 'backgroundSize',
  },
  {
    name: '背景图片是否重复铺满',
    description:
      '容器背景图片大小小于容器大小的情况下，是否重复图片直到填满背景',
    required: false,
    propName: 'backgroundRepeat',
  },
  {
    name: '高级样式',
    description:
      '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置，style类型是React.CSSProperties',
    required: false,
    propName: 'style',
  },
];

const layoutConfig = {
  name: '布局类型',
  description:
    '默认block。block: 该容器会占满一行（哪怕实际宽度不足一行，后面的内容依然会另起一行）；inline-该容器宽度默认由内容决定，多个inline(单个不满一行时)可以放在一行。',
  required: false,
  propName: 'layout',
};

export const toCComponents: ToCComponent[] = [
  {
    name: '块级布局容器',
    type: 'BlockContainer',
    description:
      '默认占满一行的容器，哪怕实际宽度不足一行，后面的内容依然会另起一行。本身没有内容，里面需要添加内容。',
    defaultAST: {
      type: 'BlockContainer',
      props: {},
      children: [],
    },
    configs: [...commonContainerConfigs],
  },
  {
    name: '行内布局容器',
    type: 'InlineContainer',
    description:
      '默认大小由内容大小决定，多个行内容器（单个宽度不足一行时）可以放在一行。本身没有内容，里面需要添加内容。',
    defaultAST: {
      type: 'InlineContainer',
      props: {},
      children: [],
    },
    configs: [...commonContainerConfigs],
  },
  {
    name: 'Flex布局容器',
    type: 'FlexContainer',
    description:
      '可以控制内容按水平或垂直方向排列，以及它们的对齐位置。本身没有内容，里面需要添加内容。',
    defaultAST: {
      type: 'FlexContainer',
      props: {
        layout: 'block',
        direction: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      children: [],
    },
    configs: [
      layoutConfig,
      {
        name: '排列方向',
        description: '内部内容的排列方向。"row"-水平排列、"column"-垂直排列。',
        required: false,
        propName: 'direction',
      },
      {
        name: '排列方向的对齐方式',
        description:
          '比如容器内部水平排列，这个配置影响的就是内容在水平方向上的对齐方式。"flex-start"-局左、"flex-end"-局右、"center"-居中、"space-between"-最左、最右的内容紧靠两边，中间内容均等间隔、"space-around"-所有内容之间均有间隔。',
        required: false,
        propName: 'justifyContent',
      },
      {
        name: '与排列垂直方向的对齐方式',
        description:
          '比如容器内部水平排列，这个配置影响的就是内容在垂直方向上的对齐方式。"flex-start"-局左、"flex-end"-局右、"center"-居中、"space-between"-最左、最右的内容紧靠两边，中间内容均等间隔、"space-around"-所有内容之间均有间隔。',
        required: false,
        propName: 'alignItems',
      },
      ...commonContainerConfigs,
    ],
  },
  {
    name: '网格布局容器',
    type: 'GridContainer',
    description:
      '可以将内部内容按网格状布局排列，比如四宫格、九宫格。本身没有内容，里面需要添加内容。',
    defaultAST: {
      type: 'GridContainer',
      props: {
        layout: 'block',
        columns: 3,
        space: 8,
        justifyContent: 'center',
      },
      children: [],
    },
    configs: [
      {
        name: '数据',
        description: '选择一个变量，类型必须的数组。',
        required: false,
        propName: 'data',
      },
      layoutConfig,
      {
        name: '列数',
        description: '网格有多少列',
        required: false,
        propName: 'columns',
      },
      {
        name: '网格内容间隙',
        description: '网格内容之间的间隙，最边缘的内容与容器之间没有间隙',
        required: false,
        propName: 'space',
      },
      {
        name: '行内对齐方式',
        description:
          '如果网格容器宽度大于一行所有内容+间隙，那么可以配置行内的对齐方式。和Flex容器的对齐方式规则一样。',
        required: false,
        propName: 'justifyContent',
      },
      {
        name: '内容渲染',
        description: '内容可以由各种UI模块组成',
        required: false,
        propName: 'renderItem.render',
      },
      {
        name: '内容渲染函数变量名',
        description:
          // eslint-disable-next-line no-template-curly-in-string
          '变量名称name会被加在"iterate_scope_variable_"后面，内容渲染的节点里可以使用 iterate_scope_variable_${name} 变量',
        required: false,
        propName: 'renderItem.iterate_scope_variable',
      },
      ...commonContainerConfigs,
    ],
  },
  {
    name: '水平滚动容器',
    type: 'ScrollList',
    description: '水平滚动列表',
    defaultAST: {
      type: 'ScrollList',
      props: {},
      children: [],
    },
  },
  {
    name: '图片',
    type: 'Image',
    description: '图片',
    defaultAST: {
      type: 'Image',
      props: {
        layout: 'inline',
        src: toCImageDemo,
        saveable: false,
        objectFit: 'cover',
        objectPosition: 'center',
      },
    },
  },
  {
    name: '文字',
    type: 'Text',
    description: '文字',
    defaultAST: {
      type: 'Text',
      props: {
        text: '文字',
        fontSize: 14,
        color: '#444444',
        fontWeight: 400,
        fontFamily: 'PingFangSC-Regular, PingFang SC',
      },
    },
  },
  {
    name: '段落',
    type: 'Paragraph',
    description: '一段文字，由多个文字组件组成',
    defaultAST: {
      type: 'Paragraph',
      props: {
        texts: ['段落'],
        fontSize: 14,
        color: '#444444',
        fontWeight: 400,
        fontFamily: 'PingFangSC-Regular, PingFang SC',
      },
    },
  },
];
