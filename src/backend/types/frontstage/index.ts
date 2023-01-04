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
  backgroundFit?: 'cover' | 'contain';
  backgroundRepeat?: boolean;
  style?: CSSProperties;
}

export interface BlockContainerProps extends CommonContainerProps {}

export interface InlineContainerProps extends CommonContainerProps {}

export interface FlexContainerProps extends CommonContainerProps {
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'flex-end' | 'center';
  alignItems?: 'flex-start' | 'flex-end' | 'center';
}

export interface GridContainerProps extends CommonContainerProps {
  // 行数
  rows: number;
  // 列数
  columns: number;
  // 间隙
  space: number | string;
  renderItem: {
    iterate_scope_variable: string;
    render: NodeAST;
  };
  rowKey?: string;
}

export interface ScrollListProps {
  data: VariableName;
  wrapperStyle?: CSSProperties;
  listStyle?: CSSProperties;
  renderItem: {
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
  textAlign?: 'left' | 'center' | 'right';
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
