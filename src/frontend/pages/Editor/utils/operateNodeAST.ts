import { isExist } from '@duitang/dt-base';
import { NodeAST } from '@/frontend/types';
import { objectInclude } from '@/frontend/utils';

export const add = (
  target: NodeAST,
  nodeAST: NodeAST | NodeAST[],
  parentProperty?: string,
) => {
  if (!parentProperty) {
    parentProperty = 'children';
  }
  switch (parentProperty) {
    case 'children':
      if (target.children) {
        if (Array.isArray(nodeAST)) {
          target.children?.push(...(nodeAST as any[]));
        } else {
          target.children?.push(nodeAST as any);
        }
      } else if ((target.props as any).renderItem) {
        if (!Array.isArray(nodeAST)) {
          (target.props as any).renderItem.render = nodeAST;
        }
        if (Array.isArray(nodeAST) && nodeAST.length === 1) {
          (target.props as any).renderItem.render = nodeAST[0];
        }
      }
      break;
    case 'renderItem':
      if ((target.props as any).renderItem && !Array.isArray(nodeAST)) {
        (target.props as any).renderItem.render = nodeAST;
      }
      break;
    default:
      break;
  }
};

export const iterateNodeAST = (
  nodeAST: NodeAST,
  callback: (nodeAST: NodeAST) => any,
) => {
  if (nodeAST) {
    callback(nodeAST);
    if (nodeAST.children) {
      nodeAST.children.forEach((child) => iterateNodeAST(child, callback));
    }
    if ((nodeAST?.props as any)?.renderItem?.render) {
      iterateNodeAST((nodeAST?.props as any)?.renderItem?.render, callback);
    }
  }
};

/**
 * @description 通过id查找nodeAST
 * @param nodeAST root
 * @param id
 * @returns 返回一个包含目标节点及其所有祖先节点的数组
 */
export const findPathById = (
  nodeAST: NodeAST,
  id: number,
  nodes?: NodeAST[],
  parentProperty?: string,
  childrenIndex?: number,
): {
  complete: boolean;
  nodes: NodeAST[];
  parentProperty: string;
  childrenIndex: number;
} => {
  if (!nodes) {
    nodes = [];
  }
  if (!parentProperty) {
    parentProperty = 'children';
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
    if (nodeAST.children && nodeAST.children.length > 0) {
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
      const render: NodeAST = (nodeAST.props as any).renderItem.render as any;
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
  root: NodeAST,
  id: number,
  props:
    | Record<string, any>
    | ((oldProps?: Record<string, any>) => Record<string, any>),
) => {
  if (props) {
    const { complete, nodes } = findPathById(root, id);
    if (complete) {
      const node = nodes[0];
      // props没变化不更新
      if (typeof props === 'object' && !objectInclude(node.props, props)) {
        node.props = { ...(node.props || {}), ...props };
      } else if (typeof props === 'function') {
        const newProps = props({ ...(node.props || {}) });
        if (!objectInclude(node.props, newProps)) {
          node.props = newProps;
        }
      }
    }
  }
};

export const remove = (root: NodeAST, id: number) => {
  const { complete, nodes, parentProperty, childrenIndex } = findPathById(
    root,
    id,
  );
  if (complete) {
    const parent = nodes[1];
    switch (parentProperty) {
      case 'children':
        if (parent.children) {
          parent.children.splice(childrenIndex, 1);
        }
        break;
      case 'renderItem':
        (parent.props as any).renderItem.render = null;
        break;
      default:
        break;
    }
  }
};

// export const move = (
//   root: NodeAST,
//   movedId: number,
//   targetId: number,
//   index?: number,
// ) => {
//   const moved = findNodeASTById(movedId);
//   const target = findNodeASTById(targetId);
//   if (moved && target) {
//     const { nodes, complete, parentProperty } = findPathById(root, targetId);
//     if (complete) {
//       const targetInStore = nodes[0];
//       remove(root, movedId);
//       switch (parentProperty) {
//         case 'children':
//           if (typeof index === 'number') {
//             targetInStore.children?.splice(index, 0, moved as any);
//           } else {
//             throw new Error('index必须是数字');
//           }
//           break;
//         case 'renderItem':
//           (targetInStore.props as any).renderItem.render = moved;
//           break;
//         default:
//           break;
//       }
//     }
//   } else {
//     throw new Error('节点不存在');
//   }
// };
