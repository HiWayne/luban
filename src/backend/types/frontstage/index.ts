/* eslint-disable no-use-before-define */
import { CSSProperties } from 'react';
import { BuiltInTypeCode, Condition, VariableName } from '..';

type NodeType =
  | 'BlockContainer'
  | 'InlineContainer'
  | 'ScrollList'
  | 'Image'
  | 'Text'
  | 'Paragraph'
  | 'FlexContainer'
  | 'GridContainer';

interface CommonContainerProps {
  width?: number | string;
  height?: number | string;
  margin?: number | string;
  padding?: number | string;
  borderRadius?: number | string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundPosition?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  backgroundSize?: 'cover' | 'contain' | string | number;
  backgroundRepeat?: boolean;
  style?: CSSProperties;
}

export interface BlockContainerProps extends CommonContainerProps {}

export interface InlineContainerProps extends CommonContainerProps {}

type FlexAlign =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-around'
  | 'space-between';

export interface FlexContainerProps extends CommonContainerProps {
  layout?: 'block' | 'inline';
  direction?: 'row' | 'column';
  justifyContent?: FlexAlign;
  alignItems?: FlexAlign;
}

export interface GridContainerProps extends CommonContainerProps {
  data?: VariableName;
  layout?: 'block' | 'inline';
  // 列数
  columns?: number;
  // 间隙（最边缘的item与外层没有间隙），10-上下左右间隙10px、"10vw"-上下左右间隙10vw、"10vw 20px"-上下10vw间隙 左右20px间隙
  space?: number | string;
  // 每行item的对齐方式
  justifyContent?: FlexAlign;
  renderItem?: {
    iterate_scope_variable: string;
    render: NodeAST;
  };
}

export interface ScrollListProps {
  data?: VariableName;
  wrapperStyle?: CSSProperties;
  listStyle?: CSSProperties;
  renderItem?: {
    iterate_scope_variable: string;
    render: NodeAST;
  };
  rowKey?: string;
}

export interface ImageProps {
  src: string | VariableName;
  layout?: 'block' | 'inline';
  width?: number | string;
  height?: number | string;
  ratio?: number;
  borderRadius?: number | string;
  saveable?: boolean;
  margin?: number | string;
  objectFit?: 'cover' | 'contain';
  objectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  style?: CSSProperties;
}

type TextAlign = 'left' | 'center' | 'right';

export interface TextProps {
  text: string | VariableName;
  width?: number | string;
  height?: number | string;
  color?: string;
  fontSize?: number | string;
  lineHeight?: number | string;
  fontWeight?: number | string;
  italic?: boolean;
  fontFamily?: string;
  textDecoration?: 'line-through' | 'underline';
  margin?: number | string;
  padding?: number | string;
  backgroundColor?: string;
  ellipsis?: boolean;
  // 当设置width时，文字对齐会有作用
  textAlign?: TextAlign;
  style?: CSSProperties;
}

interface Ellipsis {
  rows: number;
}

export interface ParagraphProps {
  texts?: NodeAST[];
  margin?: number | string;
  padding?: number | string;
  width?: number | string;
  height?: number | string;
  textAlign?: TextAlign;
  textIndent?: string;
  wrap?: boolean;
  ellipsis?: Ellipsis;
}

export interface NodeAST {
  id: number;
  key?: string | number | VariableName | BuiltInTypeCode;
  type: NodeType;
  // 左变量 === 右值 ? 渲染 : null
  condition?: Condition;
  props?:
    | BlockContainerProps
    | InlineContainerProps
    | FlexContainerProps
    | GridContainerProps
    | ScrollListProps
    | ImageProps
    | TextProps
    | ParagraphProps;
  children?: NodeAST[];
}
