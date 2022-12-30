import { Condition, VariableName } from '..';

type NodeType = 'BlockContainer' | 'ScrollList' | 'Image';

export interface BlockContainerProps {}

export interface ScrollListProps {}

export interface ImageProps {
  src: string | VariableName;
  layout?: 'block' | 'inline';
  width?: number | string;
  height?: number | string;
  ratio?: number;
  borderRadius?: number | string;
  saveable?: boolean;
  margin?: number | string;
}

export interface NodeAST {
  id: number;
  key?: string | number | VariableName;
  type: NodeType;
  // 左变量 === 右值 ? 渲染 : null
  condition?: Condition;
  props?: BlockContainerProps | ScrollListProps | ImageProps;
  children?: NodeAST[];
}
