import { FC } from 'react';
import { NodeAST } from '@/backend/types/frontstage/index';
import toCImageDemo from '../../assets/toCImageDemo.svg';
import {
  actionConfig,
  borderRadiusConfig,
  commonContainerConfigs,
  commonTextConfig,
  heightConfig,
  layoutConfig,
  listDataConfig,
  marginConfig,
  paddingConfig,
  renderItemConfig,
  styleConfig,
  widthConfig,
} from './commonConfig';

export interface FormSchema {
  type: 'input' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'image-upload';
  options: { label: string; value: any }[];
  defaultValue: any;
}

export interface Config {
  name: string;
  description: string;
  formSchema?: FormSchema;
  FormComponent?: FC;
  required: boolean;
  propName: string;
}

export interface ToCComponent {
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
      listDataConfig,
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
      ...renderItemConfig,
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
    configs: [
      listDataConfig,
      {
        name: '外层样式wrapperStyle',
        description:
          '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置，style类型是React.CSSProperties',
        required: false,
        propName: 'wrapperStyle',
      },
      {
        name: '列表样式listStyle',
        description:
          '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置，style类型是React.CSSProperties',
        required: false,
        propName: 'listStyle',
      },
      ...renderItemConfig,
      {
        name: '行key字段',
        description: 'react key所取的字段名，没有默认取循环里的index',
        required: false,
        propName: 'rowKey',
      },
    ],
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
    configs: [
      {
        name: '图片',
        description: '上传图片或设置变量名',
        required: true,
        propName: 'src',
      },
      layoutConfig,
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
    configs: [
      {
        name: '内容',
        description: '文字内容。可以是字符串，也可以是变量',
        required: true,
        propName: 'text',
      },
      marginConfig,
      paddingConfig,
      widthConfig,
      heightConfig,
      ...commonTextConfig,
      {
        name: '是否斜体',
        description: '文字是否是斜体字',
        required: false,
        propName: 'italic',
      },
      {
        name: '背景颜色',
        description: '文字背景颜色',
        required: false,
        propName: 'backgroundColor',
      },
      {
        name: '过长是否省略',
        description:
          '文字组件的宽度默认由文字数量决定。但如果你设置了组件宽度，文字过长会换行。你可以设置该配置，让文字始终单行并且过长省略（结尾省略号）。',
        required: false,
        propName: 'ellipsis',
      },
      actionConfig,
      styleConfig,
    ],
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
    configs: [
      {
        name: '内容',
        description:
          '内容可以由多个文字组件组成，文字组件里的文字样式是文字组件的样式，通过这种方式可以给一段中的某几个字单独设置颜色、背景等。内容也可以直接是字符串，字符串的文字样式就是段落的样式',
        required: true,
        propName: 'texts',
      },
      marginConfig,
      paddingConfig,
      widthConfig,
      heightConfig,
      {
        name: '首行缩进',
        description:
          '设置首行缩进的文字数。默认不缩进，如果设置2代表首行缩进2个字符长度。',
        required: false,
        propName: 'textIndent',
      },
      ...commonTextConfig,
      {
        name: '过长是否省略',
        description:
          '段落宽度默认占满整行。如果你设置了组件宽度，你可以设置该配置，如果文字超过n行后省略（结尾省略号）。',
        required: false,
        propName: 'ellipsis',
      },
    ],
  },
];
