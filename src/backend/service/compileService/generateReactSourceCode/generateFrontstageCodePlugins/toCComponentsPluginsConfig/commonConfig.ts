import { Config } from '.';

export const widthConfig: Config = {
  name: '宽度',
  description:
    '设置固定的宽度。默认单位px，也可自定义单位。若目标是块级(block)布局，宽度默认占满一行，哪怕实际内容宽度不足一行，下面的内容依然会另起一行。若是行内元素(inline)，默认宽度由内部内容决定，设置宽度不满一行时，多个可以放在同一行显示。',
  required: false,
  propName: 'width',
  formSchema: {
    type: 'css-length',
  },
};

export const heightConfig: Config = {
  name: '高度',
  description:
    '设置固定的高度。默认单位px，也可自定义单位。若不设置，高度将由内部内容撑开。',
  required: false,
  propName: 'height',
  formSchema: {
    type: 'css-length',
  },
};

export const marginConfig: Config = {
  name: '外边距',
  description:
    '边缘与外部内容的间隔距离。默认单位px，也可自定义单位。可以单独设置上下左右的边距。',
  required: false,
  propName: 'margin',
  formSchema: {
    type: 'css-margin',
  },
};

export const paddingConfig: Config = {
  name: '内边距',
  description:
    '边缘与内部内容的间隔距离。默认单位px，也可自定义单位。可以单独设置上下左右的边距。',
  required: false,
  propName: 'padding',
  formSchema: {
    type: 'css-padding',
  },
};

export const borderRadiusConfig: Config = {
  name: '圆角',
  description:
    '设置四周的圆角大小。默认单位px，也可自定义单位。举例：(n)px表示四周圆角都是(n)px、还可单独设置左上，右上，右下，左下的圆角，单位可以自定义。',
  required: false,
  propName: 'borderRadius',
  formSchema: {
    type: 'css-border-radius',
    props: {
      labels: ['左上', '右上', '右下', '左下'],
    },
  },
};

export const styleConfig: Config = {
  name: '高级样式',
  description:
    '在基础样式无法满足需求的情况下使用，一般由有前端开发经验的人员设置。样式含义和css规范一致。',
  required: false,
  propName: 'style',
  formSchema: {
    type: 'custom-style',
  },
};

export const actionConfig: Config = {
  name: '点击行为',
  description:
    '定义点击该组件时该做什么。比如你希望点击图片跳转到某个页面、点击按钮发起请求等。复杂逻辑的配置需要了解前端框架的状态机制，建议由有前端开发经验的人员配置。',
  required: false,
  propName: 'action',
  formSchema: {
    type: 'action',
  },
};

export const layoutConfig: Config = {
  name: '布局类型',
  description:
    '默认块级(block)。块级(block): 该容器会占满一行（哪怕实际内容宽度不足一行，下面的内容依然会另起一行）；行内(inline)-该容器宽度默认由内容决定，多个inline(单个不满一行时)可以放在一行。',
  required: false,
  propName: 'layout',
  formSchema: {
    type: 'select',
    options: [
      {
        label: '块级',
        value: 'block',
      },
      {
        label: '行内',
        value: 'inline',
      },
    ],
  },
  defaultConfig: 'block',
};

export const commonContainerConfigs: Config[] = [
  layoutConfig,
  widthConfig,
  heightConfig,
  marginConfig,
  paddingConfig,
  borderRadiusConfig,
  {
    name: '背景颜色',
    description: '容器背景颜色',
    required: false,
    propName: 'backgroundColor',
    formSchema: {
      type: 'color-picker',
    },
  },
  {
    name: '背景图片',
    description: '容器背景图片。',
    required: false,
    propName: 'backgroundImage',
    formSchema: {
      type: 'image-upload',
    },
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
    formSchema: {
      type: 'bg-size',
    },
  },
  {
    name: '是否重复铺满',
    description:
      '背景图片的大小 < 容器的大小时，是否重复显示背景图片直到填满背景',
    required: false,
    propName: 'backgroundRepeat',
    formSchema: {
      type: 'switch',
    },
  },
  styleConfig,
];

export const colorConfig: Config = {
  name: '文字颜色',
  description: '文字颜色。默认#444444。',
  required: false,
  propName: 'color',
  formSchema: {
    type: 'color-picker',
  },
  defaultConfig: '#444444',
};

export const fontSizeConfig: Config = {
  name: '文字大小',
  description: '文字大小。默认14px，也可自定义单位。',
  required: false,
  propName: 'fontSize',
  formSchema: {
    type: 'css-length',
  },
  defaultConfig: {
    value: 14,
    unit: 'rem',
  },
};

export const lineHeightConfig: Config = {
  name: '行高',
  description: '文字所在行的高度。默认1.1倍的文字高度。',
  required: false,
  propName: 'lineHeight',
  formSchema: {
    type: 'css-length',
  },
  defaultConfig: {
    value: 1.1,
    unit: '',
  },
};

export const fontWeightConfig: Config = {
  name: '文字粗细',
  description:
    '文字粗细。可以以数字描述粗细，比如400、600、700。也可以直接使用"normal"表示正常、"bold"表示粗、"bolder"表示更粗',
  required: false,
  propName: 'fontWeight',
};

export const fontFamilyConfig: Config = {
  name: '字体',
  description:
    '文字使用的字体名称。可以有多个字体，之间用英文逗号隔开。如果设备没有安装第一个字体，会应用第二个，以此类推。默认："PingFangSC-Regular, PingFang SC"',
  required: false,
  propName: 'fontFamily',
  formSchema: {
    type: 'input',
  },
  defaultConfig: 'PingFangSC-Regular, PingFang SC',
};

export const textDecorationConfig: Config = {
  name: '文字横线',
  description: '文字是否需要删除线、下划线',
  required: false,
  propName: 'textDecoration',
  formSchema: {
    type: 'select',
    options: [
      {
        label: '无',
        value: '',
      },
      {
        label: '下划线',
        value: 'underline',
      },
      {
        label: '删除线',
        value: 'line-through',
      },
    ],
  },
};

export const textAlignConfig: Config = {
  name: '对齐方式',
  description:
    '如果你设置了组件宽度，并且文字长度小于组件宽度。你可以设置文字的对齐方式。举例："center"-居中、"left"-居左（默认）、"right"-居右。',
  required: false,
  propName: 'textAlign',
  formSchema: {
    type: 'select',
    options: [
      {
        label: '居中',
        value: 'center',
      },
      {
        label: '居左',
        value: 'left',
      },
      {
        label: '居右',
        value: 'right',
      },
    ],
  },
};

export const commonTextConfig = [
  colorConfig,
  fontSizeConfig,
  fontWeightConfig,
  fontFamilyConfig,
  lineHeightConfig,
  textAlignConfig,
  textDecorationConfig,
];

export const listDataConfig: Config = {
  name: '数据',
  description: '选择一个变量，类型必须的数组。',
  required: false,
  propName: 'data',
  formSchema: {
    type: 'variable-select',
  },
};

export const renderItemConfig: Config[] = [
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
    formSchema: {
      type: 'input',
    },
  },
];
