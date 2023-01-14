import { Action, Condition, VariableName } from '..';

export * from '../esAst';

export type NodeType =
  | 'BlockContainer'
  | 'InlineContainer'
  | 'Form'
  | 'InputWithLabel'
  | 'SelectWithLabel'
  | 'RadioGroupWithLabel'
  | 'CheckboxGroupWithLabel'
  | 'RangePickerWithLabel'
  | 'Button'
  | 'Table'
  | 'Image'
  | 'ImageGroup'
  | 'Grid'
  | 'Avatar'
  | 'Text'
  | 'Title'
  | 'Paragraph'
  | 'Space'
  | 'Modal'
  | 'List';

export interface InputWithLabelProps {
  label?: string | VariableName;
  name?: string | VariableName;
  value: VariableName;
  setValue: VariableName;
  width?: number;
  placeholder?: string;
  size?: 'large' | 'middle' | 'small';
  defaultValue?: string | VariableName;
  disabled?: boolean | VariableName;
  maxLength?: number;
  showCount?: boolean;
}

export interface SelectWithLabelProps {
  label?: string | VariableName;
  name?: string | VariableName;
  width?: number;
  options: { label: string; value: string | number }[];
  value: VariableName;
  setValue: VariableName;
  defaultValue?: string | number;
}

export interface RadioGroupWithLabelProps {
  label?: string | VariableName;
  name?: string | VariableName;
  options: { label: string; value: string | number }[];
  direction?: 'vertical' | 'horizontal';
  value: VariableName;
  setValue: VariableName;
  defaultValue?: string | number;
}

export interface CheckboxGroupWithLabelProps {
  label?: string | VariableName;
  name?: string | VariableName;
  options: { label: string; value: string | number }[];
  value: VariableName;
  setValue: VariableName;
  defaultValue?: string | number;
}

export interface RangePickerWithLabelProps {
  label?: string | VariableName;
  name?: string | VariableName;
  value1: VariableName;
  value2: VariableName;
  setValue: VariableName;
  defaultValue?: [string, string];
  format?: string;
  placeholder?: [string, string];
}

export interface Pagination {
  // 当前页数
  current: VariableName;
  // 设置当前页数
  setCurrent: VariableName;
  pageSize: number;
  // 只有一页时是否隐藏分页器
  hideOnSinglePage?: boolean;
  // 是否可以快速跳转至某页
  showQuickJumper?: boolean;
  // 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
  showSizeChanger?: boolean;
  // 当添加该属性时，显示为简单分页
  simple?: boolean;
  // 当为 small 时，是小尺寸分页
  size?: 'default' | 'small';
  // 数据总数
  total: VariableName;
  // 页码或pageSize变化时触发，function(page, pageSize)
  // eslint-disable-next-line no-use-before-define
  action: Action;
}

export interface TableProps {
  data: VariableName;
  columns: {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    fixed?: boolean;
    render?: {
      iterate_scope_variable: string;
      // eslint-disable-next-line no-use-before-define
      render: NodeAST[] | undefined;
    };
  }[];
  rowKey: string;
  pagination?: Pagination;
}

export interface ButtonProps {
  text: string;
  action: Action;
  block?: boolean | VariableName;
  danger?: boolean | VariableName;
  disabled?: boolean | VariableName;
  ghost?: boolean | VariableName;
  href?: string | VariableName;
  htmlType?: string | VariableName;
  icon?: VariableName;
  loading?: VariableName;
  shape?: 'default' | 'circle' | 'round' | VariableName;
  size?: 'large' | 'middle' | 'small' | VariableName;
  target?: string | VariableName;
  type?:
    | 'primary'
    | 'ghost'
    | 'dashed'
    | 'link'
    | 'text'
    | 'default'
    | VariableName;
  onClick?: VariableName;
}

export interface ImageProps {
  alt?: string;
  fallback?: string;
  width?: number;
  height?: number;
  preview?: boolean;
  placeholder?: boolean;
  src: string | VariableName;
  objectFit?: 'cover' | 'contain';
}

export interface ImageGroupProps {
  images: string[] | VariableName;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain';
}

type ReactiveSize = {
  [key in 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl']?: ReactiveSize | number;
};

export interface GridProps {
  row: number;
  column: number;
  // 水平对齐方式
  /** xs-屏幕 < 576px、sm-屏幕 ≥ 576px、md-屏幕 ≥ 768px、lg-屏幕 ≥ 992px、xl-屏幕 ≥ 1200px、xxl-屏幕 ≥ 1600px
      可为栅格数或一个包含其他属性的对象
  */
  justify?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | {
        [key in 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl']:
          | 'start'
          | 'end'
          | 'center'
          | 'space-around'
          | 'space-between'
          | 'space-evenly';
      };
  // 垂直对齐方式
  align?:
    | 'top'
    | 'middle'
    | 'bottom'
    | 'stretch'
    | {
        [key in 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl']?:
          | 'top'
          | 'middle'
          | 'bottom'
          | 'stretch';
      };
  // 栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24}。或者使用数组形式同时设置 [水平间距, 垂直间距]
  gutter?: number | ReactiveSize | [number, number];
  // 是否自动换行
  wrap?: boolean;
  // 按从左到右、从上到下的顺序
  items?: (
    | ({
        // flex 布局属性，如果是数字表示这一行占比（<Item flex={2} /><Item flex={3} />，第一个Item占2/5）
        flex?: string | number;
        // 栅格左侧的间隔格数，间隔内不可以有栅格
        offset?: number;
        // 栅格顺序
        order?: number;
        // 栅格向左移动格数
        pull?: number;
        // 栅格向右移动格数
        push?: number;
        // 栅格占位格数，为 0 时相当于 display: none
        span?: number;
      } & ReactiveSize)
    | undefined
  )[];
}

export interface AvatarProps {
  alt?: string;
  gap?: number;
  shape?: 'circle' | 'square';
  size?:
    | number
    | 'large'
    | 'small'
    | 'default'
    | {
        [key in 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl']?:
          | 'top'
          | 'middle'
          | 'bottom'
          | 'stretch';
      };
  src: string | VariableName;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  fallback?: string;
}

type Size = 'small' | 'middle' | 'large' | number;

export interface SpaceProps {
  // 是否自动换行，仅在 horizontal 时有效
  wrap?: boolean;
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'end' | 'center' | 'baseline';
  size?: Size | Size[];
}

interface Ellipsis {
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  tooltip?: boolean;
}

interface CommonTextProps {
  text: string | VariableName;
  copyable?: boolean;
  delete?: boolean;
  disabled?: boolean;
  ellipsis?: boolean | Ellipsis;
  // 添加键盘样式
  keyboard?: boolean;
  // 添加标记样式
  mark?: boolean;
  strong?: boolean;
  italic?: boolean;
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  underline?: boolean;
  size?: number;
  color?: string;
}

export interface TextProps extends CommonTextProps {}

export interface TitleProps extends CommonTextProps {
  // 重要程度，相当于 h1、h2、h3、h4、h5
  level: 1 | 2 | 3 | 4 | 5;
}

export interface ParagraphProps extends CommonTextProps {}

export interface ModalProps {
  open: VariableName;
  setOpen: VariableName;
  cancelText?: string;
  okText?: string;
  okType?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
  title?: string;
  width?: string | number;
  okAction: Action;
  cancelAction?: Action;
}

export interface ListProps {
  dataSource: VariableName;
  bordered?: boolean;
  // eslint-disable-next-line no-use-before-define
  footer?: NodeAST;
  // eslint-disable-next-line no-use-before-define
  header?: NodeAST;
  itemLayout?: 'horizontal' | 'vertical';
  emptyText?: string;
  renderItem: {
    iterate_scope_variable: string;
    // eslint-disable-next-line no-use-before-define
    render: NodeAST;
  };
  rowKey?: string;
  size?: 'default' | 'large' | 'small';
  split?: boolean;
}

export interface NodeAST {
  id: number;
  key?: string | number | VariableName;
  type: NodeType;
  // 左变量 === 右值 ? 渲染 : null
  condition?: Condition;
  props?:
    | InputWithLabelProps
    | SelectWithLabelProps
    | TableProps
    | ButtonProps
    | ImageProps
    | ImageGroupProps
    | GridProps
    | AvatarProps
    | TextProps
    | TitleProps
    | ParagraphProps
    | SelectWithLabelProps
    | RangePickerWithLabelProps
    | SpaceProps
    | ModalProps
    | ListProps;
  children?: NodeAST[];
}
