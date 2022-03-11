import { FunctionComponent, useContext, useMemo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { produce } from 'immer';
import { EditableWrapperProps, HighLightPosition } from '@core/components/EditableWrapper';
import { VdomTreeContext } from '../../render/index';
import { ComponentLevel } from '@core/types/types';

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
}

enum DnDTypes {
  UI = 'UI',
  MATERIALS = 'MATERIALS',
}
const equalArray = (arr1: (string | number)[], arr2: (string | number)[]) =>
  arr1.length === arr2.length && arr1.every((value: number | string, index: number) => arr2[index] === value);

const compareInSameLevel = (arr1: (string | number)[], arr2: (string | number)[]) =>
  arr1.length === arr2.length &&
  arr1.every((value: number | string, index: number) => {
    if (index !== arr1.length - 1) {
      return value === arr2[index];
    } else {
      return value !== arr2[index];
    }
  });

const aOnTopOfB = (arr1: (string | number)[], arr2: (string | number)[]) =>
  arr1.length === arr2.length &&
  arr1.every((value: number | string, index: number) => {
    if (index !== arr1.length - 1) {
      return value === arr2[index];
    } else {
      if (typeof value === 'number' && typeof arr2[index] === 'number') {
        return value === (arr2[index] as number) - 1;
      } else {
        return false;
      }
    }
  });

// 得到vdom中类children的属性名称
const getChildrenLikeKey = (vdom: VDomNode, position?: string): keyof Partial<VDomNode> | '' | null => {
  if (!vdom) {
    throw new Error('getChildrenLikeKey must have vdom');
  }
  if (Array.isArray(vdom)) {
    return '';
  }
  if (typeof vdom.name === 'string') {
    switch (vdom.name) {
      case 'modal':
        if (typeof position === 'string') {
          return position as keyof Partial<VDomNode>;
        } else {
          return 'content';
        }
      case 'table':
        if (vdom.level === ComponentLevel.ADVANCED) {
          return 'columns';
        } else {
          return 'children';
        }
      default:
        return 'children';
    }
  } else {
    return null;
  }
};

export const getArrayFromNode = (vdomNode: VDomNode | null, position?: string): VDomNode[] | null => {
  if (Array.isArray(vdomNode)) {
    return vdomNode;
  }
  if (!vdomNode) {
    return null;
  }
  const key = getChildrenLikeKey(vdomNode, position);
  if (key === 'columns') {
    const [itemHasRender] = Array.isArray(vdomNode[key])
      ? (vdomNode[key] as any[]).filter((item: Record<string, any>) => item && Array.isArray(item.render))
      : [null];
    if (itemHasRender === null) {
      return null;
    } else {
      return itemHasRender.render;
    }
  } else if (key) {
    return vdomNode[key as keyof Partial<VDomNode>];
  } else if (key === '') {
    return vdomNode as any;
  } else {
    return null;
  }
};

/**
 * @description 根据一个表示每层索引的数组，找到最后节点位置的上一层
 * const demo = {
 *   id: 1,
 *   children: [
 *     {
 *       id: 2,
 *       children: [
 *         {
 *           id: 4
 *         }
 *       ]
 *     },
 *     {
 *       id: 3
 *     }
 *   ]
 *  }
 * findNearestParent(demo, [0, 0]) 返回 id: 1的节点
 * findNearestParent(demo, [0, 0, 0]) 返回 id: 2的节点
 * findNearestParent(demo, [0, 0, 0, 0]) 属于hack用法，因为没有第四层，所以作用相当于取最后一个节点，返回 id: 4的节点
 *
 * 由于VDomNode类型不只有children表示子节点，所以该函数内部还有其他的字段需要考虑，比如table里是columns里的render而不是children
 * 另外还有一个特殊的：modal的content、footer，它们会被返回而不是modal
 */
export const findNearestParent = (vdomTree: VDomNode[], indexes: (string | number)[]): VDomNode | null => {
  if (!vdomTree || !Array.isArray(indexes) || indexes.length === 0) {
    return null;
  }
  // @ts-ignore
  return indexes.reduce((target: VDomNode | VDomNode[], position: number | string, index: number) => {
    if (index < indexes.length - 1) {
      if (Array.isArray(target) && typeof position === 'number') {
        const nextNode = target[position];
        return nextNode as VDomNode;
      } else if (target) {
        const targetWithArray = getArrayFromNode(
          target as VDomNode,
          typeof position === 'string' ? position : undefined,
        );
        if (typeof position !== 'string' && Array.isArray(targetWithArray)) {
          const nextNode = targetWithArray[position];
          return nextNode as VDomNode;
        } else if (typeof position === 'string') {
          return targetWithArray;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return target;
    }
  }, vdomTree);
};

export const findLastObject = (vdomTree: VDomNode[], indexes: (string | number)[]): VDomNode => {
  // hack
  return findNearestParent(vdomTree, [...indexes, 0]) as any;
};

const clearHierarchicalRecordsInArray = (vdomNodes: VDomNode[]) => {
  if (!Array.isArray(vdomNodes)) {
    if (vdomNodes) {
      // @ts-ignore
      delete vdomNodes.hierarchicalRecords;
    }
  } else {
    vdomNodes.forEach((vdomNode) => {
      // @ts-ignore
      delete vdomNode.hierarchicalRecords;
    });
  }
};

// 同层级移动
export const _inner_move_layout_in_same_level = (
  vdomTree: VDomNode[],
  dragIndexes: (string | number)[],
  hoverIndexes: (string | number)[],
) => {
  const container = getArrayFromNode(findNearestParent(vdomTree, dragIndexes)) as VDomNode[];
  const lastIndex = dragIndexes.length - 1;
  const dragLeapPosition = dragIndexes[lastIndex] as number;
  const dropLeapPosition = hoverIndexes[lastIndex] as number;
  const dragObject = container[dragLeapPosition];
  const dropObject = container[dropLeapPosition];
  const dragHierarchicalRecords = dragObject.hierarchicalRecords;
  const dropHierarchicalRecords = dropObject.hierarchicalRecords;
  dragObject.hierarchicalRecords = dropHierarchicalRecords;
  dropObject.hierarchicalRecords = dragHierarchicalRecords;
  container[dragLeapPosition] = dropObject;
  container[dropLeapPosition] = dragObject;
};

// 跨层级移动
export const _inner_move_layout_cross_level = (
  direction: Direction,
  vdomTree: VDomNode[],
  dragIndexes: (string | number)[],
  hoverIndexes: (string | number)[],
) => {
  const dragContainer = getArrayFromNode(findNearestParent(vdomTree, dragIndexes)) as VDomNode[];
  const dragLastIndex = dragIndexes.length - 1;
  const dragLeapPosition = dragIndexes[dragLastIndex] as number;
  const dragObject = dragContainer[dragLeapPosition];
  dragContainer.splice(dragLeapPosition, 1);
  clearHierarchicalRecordsInArray(dragContainer);

  const dropContainer = getArrayFromNode(findNearestParent(vdomTree, hoverIndexes)) as VDomNode[];
  const dropLeapPosition = hoverIndexes[hoverIndexes.length - 1] as number;
  if (direction === Direction.UP) {
    dropContainer.splice(dropLeapPosition, 0, dragObject);
  } else if (direction === Direction.DOWN) {
    dropContainer.splice(dropLeapPosition + 1, 0, dragObject);
  }
  clearHierarchicalRecordsInArray(dropContainer);
};

// 移动进某节点内部
export const _inner_move_layout_to_internal = (
  vdomTree: VDomNode[],
  dragIndexes: (string | number)[],
  hoverIndexes: (string | number)[],
) => {
  const dragContainer = getArrayFromNode(findNearestParent(vdomTree, dragIndexes)) as VDomNode[];
  const dragLastIndex = dragIndexes.length - 1;
  const dragLeapPosition = dragIndexes[dragLastIndex] as number;
  const dragObject = dragContainer[dragLeapPosition];

  const dropObject = findLastObject(vdomTree, hoverIndexes);
  const dropObjectArrayPart = getArrayFromNode(dropObject);
  if (Array.isArray(dropObjectArrayPart)) {
    if (dragObject.hierarchicalRecords) {
      // @ts-ignore
      delete dragObject.hierarchicalRecords;
    }
    dragContainer.splice(dragLeapPosition, 1);
    dropObjectArrayPart.push(dragObject);
    clearHierarchicalRecordsInArray(dragContainer);
    clearHierarchicalRecordsInArray(dropObjectArrayPart);
  } else {
    return;
  }
};

const isCanInsert = (vdom: VDomNode) => {
  const key = getChildrenLikeKey(vdom);
  return !!key;
};

interface useRenderEditableWrapperReturn {
  extraStyleOfRoot: any;
  renderedEditable: JSX.Element | null;
}

interface DragItem {
  type: string;
  id: number;
  indexes: (string | number)[];
}

/**
 * @description 返回可编辑组件外壳，组件额外style的hooks
 * @param {FunctionComponent<EditableWrapperProps>} renderEditableWrapper 可编辑组件外壳
 * @returns {useRenderEditableWrapperReturn}
 */
const useRenderEditableWrapper = (
  renderEditableWrapper: FunctionComponent<EditableWrapperProps> | undefined,
  vdomNode: VDomNode | CommonProps,
): useRenderEditableWrapperReturn => {
  const [vdomTree, setVdomTree] = useContext(VdomTreeContext);

  const [highLightPosition, setHighLightPosition] = useState<HighLightPosition>(HighLightPosition.NONE);

  const ref = useRef<HTMLElement>(null);

  const canInsert = useMemo(() => isCanInsert(vdomNode as VDomNode), [vdomNode]);

  const moveLayoutInSameLevel = useMemo(
    () => (dragIndexes: (string | number)[], hoverIndexes: (string | number)[]) => {
      if (compareInSameLevel(dragIndexes, hoverIndexes)) {
        const newVdomTree = produce(vdomTree, (draft: VDomNode[]) => {
          _inner_move_layout_in_same_level(draft, dragIndexes, hoverIndexes);
        });
        setVdomTree(newVdomTree);
      } else {
      }
    },
    [vdomTree, setVdomTree],
  );

  const moveLayoutCrossLevel = useMemo(
    () => (direction: Direction, dragIndexes: (string | number)[], hoverIndexes: (string | number)[]) => {
      const newVdomTree = produce(vdomTree, (draft: VDomNode[]) => {
        _inner_move_layout_cross_level(direction, draft, dragIndexes, hoverIndexes);
      });
      setVdomTree(newVdomTree);
    },
    [vdomTree, setVdomTree],
  );

  const moveLayoutToInternal = useMemo(
    () => (dragIndexes: (string | number)[], hoverIndexes: (string | number)[]) => {
      const newVdomTree = produce(vdomTree, (draft: VDomNode[]) => {
        _inner_move_layout_to_internal(draft, dragIndexes, hoverIndexes);
      });
      if (!Object.is(vdomTree, newVdomTree)) {
        setVdomTree(newVdomTree);
      }
    },
    [vdomTree, setVdomTree],
  );

  const [{ isDragging }, drag] = useDrag({
    type: DnDTypes.UI,
    item: () => ({ id: (vdomNode as VDomNode).id, indexes: vdomNode.hierarchicalRecords }),
    collect: (monitor: any) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const [{ handlerId, isOver }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null; isOver: boolean }>({
    accept: DnDTypes.UI,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    drop(item: DragItem, monitor) {
      const dragIndexes = item.indexes;
      const hoverIndexes = vdomNode.hierarchicalRecords;

      if (equalArray(dragIndexes, hoverIndexes)) {
        return;
      }

      const hoverBoundingRect = (ref.current as HTMLElement).getBoundingClientRect();

      const hoverOneThirdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;

      // 鼠标位置
      const clientOffset = monitor.getClientOffset();

      // 鼠标y方向距hover目标顶部的距离
      const hoverClientYToTop = Math.abs((clientOffset as XYCoord).y - hoverBoundingRect.top);

      // 鼠标y方向距hover目标底部的距离
      const hoverClientYToBottom = Math.abs((clientOffset as XYCoord).y - hoverBoundingRect.bottom);

      // 仅当鼠标越过项目高度的上下1/3时才执行移动
      // 向下拖动时，仅在光标低于 33% 时移动
      // 向上拖动时，仅在光标高于 33% 时移动
      // 中间区域认为移动至hover目标内部

      const isSameLevel = compareInSameLevel(dragIndexes, hoverIndexes);

      // Dragging downwards
      if (isSameLevel && aOnTopOfB(dragIndexes, hoverIndexes) && hoverClientYToTop < hoverOneThirdY) {
        return;
      }

      // Dragging upwards
      if (isSameLevel && aOnTopOfB(hoverIndexes, dragIndexes) && hoverClientYToBottom < hoverOneThirdY) {
        return;
      }

      // Time to actually perform the action{
      if (hoverClientYToBottom < hoverOneThirdY) {
        if (isSameLevel) {
          moveLayoutInSameLevel(dragIndexes, hoverIndexes);
        } else {
          moveLayoutCrossLevel(Direction.DOWN, dragIndexes, hoverIndexes);
        }
      } else if (hoverClientYToTop < hoverOneThirdY) {
        if (isSameLevel) {
          moveLayoutInSameLevel(dragIndexes, hoverIndexes);
        } else {
          moveLayoutCrossLevel(Direction.UP, dragIndexes, hoverIndexes);
        }
      } else {
        moveLayoutToInternal(dragIndexes, hoverIndexes);
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // item.indexes = hoverIndexes;
    },
    hover(item: DragItem, monitor) {
      const dragIndexes = item.indexes;
      const hoverIndexes = vdomNode.hierarchicalRecords;

      if (equalArray(dragIndexes, hoverIndexes)) {
        return;
      }

      const hoverBoundingRect = (ref.current as HTMLElement).getBoundingClientRect();

      const hoverOneThirdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;

      // 鼠标位置
      const clientOffset = monitor.getClientOffset();

      // 鼠标y方向距hover目标顶部的距离
      const hoverClientYToTop = Math.abs((clientOffset as XYCoord).y - hoverBoundingRect.top);

      // 鼠标y方向距hover目标底部的距离
      const hoverClientYToBottom = Math.abs((clientOffset as XYCoord).y - hoverBoundingRect.bottom);

      // 仅当鼠标越过项目高度的上下1/3时才执行移动
      // 向下拖动时，仅在光标低于 33% 时移动
      // 向上拖动时，仅在光标高于 33% 时移动
      // 中间区域认为移动至hover目标内部

      const isSameLevel = compareInSameLevel(dragIndexes, hoverIndexes);

      // Dragging downwards
      if (isSameLevel && aOnTopOfB(dragIndexes, hoverIndexes) && hoverClientYToTop < hoverOneThirdY) {
        return;
      }

      // Dragging upwards
      if (isSameLevel && aOnTopOfB(hoverIndexes, dragIndexes) && hoverClientYToBottom < hoverOneThirdY) {
        return;
      }

      // Time to actually perform the action

      if (hoverClientYToBottom < hoverOneThirdY) {
        // 下
        setHighLightPosition(HighLightPosition.BOTTOM);
      } else if (hoverClientYToTop < hoverOneThirdY) {
        // 上
        setHighLightPosition(HighLightPosition.TOP);
      } else {
        // 中
        setHighLightPosition(HighLightPosition.CENTER);
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // item.indexes = hoverIndexes;
    },
  });

  if (!isOver && highLightPosition !== HighLightPosition.NONE) {
    setHighLightPosition(HighLightPosition.NONE);
  }

  drag(drop(ref));

  // const opacity = useMemo(() => (isDragging ? 0 : 1), [isDragging]);

  const RenderEditableWrapper = useMemo(() => renderEditableWrapper || (() => null), [renderEditableWrapper]);

  const renderedEditable = useMemo(
    () => (
      <RenderEditableWrapper
        ref={ref}
        vdomNode={vdomNode}
        vdomTree={vdomTree}
        setVdomTree={setVdomTree}
        highLightPosition={highLightPosition}
        canInsert={canInsert}
      />
    ),
    [RenderEditableWrapper, vdomNode, vdomTree, setVdomTree, highLightPosition, canInsert],
  );

  const extraStyleOfRoot = useMemo(
    () => (renderEditableWrapper ? { position: 'relative' } : {}),
    [renderEditableWrapper],
  );

  const result = useMemo(
    () => ({
      extraStyleOfRoot,
      renderedEditable,
    }),
    [extraStyleOfRoot, renderedEditable],
  );

  return result;
};

export default useRenderEditableWrapper;
