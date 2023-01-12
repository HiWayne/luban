import { isExist } from '@duitang/dt-base';
import { NodeAST as NodeASTOfFrontstage } from '@/backend/types/frontstage';
import { NodeAST as NodeASTOfBackstage } from '@/backend/types/backstage';

export const add = (
  target: NodeASTOfFrontstage | NodeASTOfBackstage,
  nodeAST: NodeASTOfFrontstage | NodeASTOfBackstage,
  parentProperty?: string,
) => {
  if (!parentProperty) {
    parentProperty = 'children';
  }
  switch (parentProperty) {
    case 'children':
      if (Array.isArray(target.children)) {
        target.children?.push(nodeAST as any);
      } else if ((target.props as any).renderItem) {
        (target.props as any).renderItem.render = nodeAST;
      }
      break;
    case 'renderItem':
      if ((target.props as any).renderItem) {
        (target.props as any).renderItem.render = nodeAST;
      }
      break;
    default:
      break;
  }
};

/**
 * @description 通过id查找nodeAST
 * @param nodeAST root
 * @param id
 * @returns 返回一个包含目标节点及其所有祖先节点的数组
 */
export const findPathById = (
  nodeAST: NodeASTOfFrontstage | NodeASTOfBackstage,
  id: number,
  nodes?: (NodeASTOfFrontstage | NodeASTOfBackstage)[],
  parentProperty?: string,
  childrenIndex?: number,
): {
  complete: boolean;
  nodes: (NodeASTOfFrontstage | NodeASTOfBackstage)[];
  parentProperty: string;
  childrenIndex: number;
} => {
  if (!nodes) {
    nodes = [];
  }
  if (!parentProperty) {
    parentProperty = '';
  }
  if (!isExist(childrenIndex)) {
    childrenIndex = 0;
  }
  const currentNodes = [...nodes];
  if (nodeAST.id === id) {
    currentNodes.unshift(nodeAST);
    return {
      complete: true,
      nodes: currentNodes,
      parentProperty,
      childrenIndex: childrenIndex as number,
    };
  } else {
    if (Array.isArray(nodeAST.children) && nodeAST.children.length > 0) {
      currentNodes.unshift(nodeAST);
      const childrenLength = nodeAST.children.length;
      for (let i = 0; i < childrenLength; i++) {
        const result = findPathById(
          nodeAST.children[i],
          id,
          currentNodes,
          'children',
          i,
        );
        if (result.complete) {
          return result;
        }
      }
    }
    if (nodeAST.props && (nodeAST.props as any).renderItem) {
      const render: NodeASTOfFrontstage | NodeASTOfBackstage = (
        nodeAST.props as any
      ).renderItem.render as any;
      const result = findPathById(render, id, currentNodes, 'renderItem');
      if (result.complete) {
        return result;
      }
    }
    return {
      complete: false,
      nodes: currentNodes,
      parentProperty,
      childrenIndex: childrenIndex as number,
    };
  }
};

export const update = (
  root: NodeASTOfFrontstage | NodeASTOfBackstage,
  id: number,
  props:
    | Record<string, any>
    | ((oldProps?: Record<string, any>) => Record<string, any>),
) => {
  if (props) {
    const { complete, nodes } = findPathById(root, id);
    if (complete) {
      const node = nodes[0];
      if (typeof props === 'object') {
        node.props = { ...(node.props || {}), ...props };
      } else if (typeof props === 'function') {
        node.props = props({ ...(node.props || {}) });
      }
    }
  }
};

export const remove = (
  root: NodeASTOfFrontstage | NodeASTOfBackstage,
  id: number,
) => {
  const { complete, nodes, parentProperty, childrenIndex } = findPathById(
    root,
    id,
  );
  if (complete) {
    const parent = nodes[1];
    switch (parentProperty) {
      case 'children':
        parent.children?.splice(childrenIndex, 1);
        break;
      case 'renderItem':
        (parent.props as any).renderItem.render = null;
        break;
      default:
        break;
    }
  }
};
