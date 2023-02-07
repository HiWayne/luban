import { isExist } from '@duitang/dt-base';
import { message } from 'antd';
import { NodeAST } from '@/frontend/types';
import { objectInclude } from '@/frontend/utils';
import {
  copyNodeASTToParentInMap,
  findNodeASTById,
} from './highPerformanceStructureOfEditor';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import { toCComponents } from '../ToCEditor';

export const add = (
  target: NodeAST | null,
  nodeAST: NodeAST | NodeAST[],
  parentProperty?: string,
) => {
  if (!target?.children && !target?.props) {
    (target as any).view = nodeAST;
    return;
  }
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

export const findChildrenOfNodeAST = (nodeAST: NodeAST): NodeAST[] | null => {
  if (nodeAST.children) {
    return nodeAST.children;
  } else if ((nodeAST.props as any)?.renderItem?.render) {
    return [(nodeAST.props as any).renderItem.render];
  } else {
    return null;
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

export const copyNodeASTToParent = (root: NodeAST, id: number) => {
  const nodeAST = findNodeASTById(id);
  if (nodeAST?.parent) {
    const { complete, nodes } = findPathById(root, nodeAST.parent);
    if (complete) {
      const parent = nodes[0];
      if (!parent?.children) {
        message.warning('父组件该位置只允许单节点');
        return;
      }
      const copiedNodeAST = copyNodeASTToParentInMap(id);
      if (copiedNodeAST) {
        add(parent, copiedNodeAST);
      }
    }
  }
};

export const getComponentOfNodeAST = (id: number) => {
  const nodeASTType = findNodeASTById(id)?.type;
  if (nodeASTType) {
    const targetComponent: ToCComponent | undefined = toCComponents.find(
      (component) => component.type === nodeASTType,
    );
    return targetComponent || null;
  } else {
    return null;
  }
};
