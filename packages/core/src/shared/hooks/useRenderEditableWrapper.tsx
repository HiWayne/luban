import { FunctionComponent, RefObject, useContext, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { produce } from 'immer';
import { EditableWrapperProps } from '@core/components/EditableWrapper';
import { VdomTreeContext } from '../../render/index';
import { ComponentLevel } from '@core/types/types';

enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
}

enum DnDTypes {
  UI = 'UI',
  MATERIALS = 'MATERIALS',
}
const equalNumberArray = (arr1: number[], arr2: number[]) =>
  arr1.length === arr2.length && arr1.every((number, index) => arr2[index] === number);

const compareInSameLevel = (arr1: number[], arr2: number[]) =>
  arr1.length === arr2.length &&
  arr1.every((number, index) => {
    if (index !== arr1.length - 1) {
      return number === arr2[index];
    } else {
      return number !== arr2[index];
    }
  });

const aOnTopOfB = (arr1: number[], arr2: number[]) =>
  arr1.length === arr2.length &&
  arr1.every((number, index) => {
    if (index !== arr1.length - 1) {
      return number === arr2[index];
    } else {
      return number < arr2[index];
    }
  });

// 得到vdom中类children的属性名称
const getChildrenLikeKey = (vdom: VDomNode): keyof VDomNode => {
  if (!vdom) {
    return 'children';
  }
  switch (vdom.name) {
    case 'modal':
      return 'content';
    case 'table':
      if (vdom.level === ComponentLevel.ADVANCED) {
        return 'columns';
      } else {
        return 'children';
      }
    default:
      return 'children';
  }
};

const findNearestParent = (vdomTree: VDomNode[], indexes: number[]): VDomNode[] => {
  return indexes.reduce((result, position, index) => {
    if (index !== indexes.length - 1) {
      if (Array.isArray(result)) {
        return result[position];
      } else {
        const key = getChildrenLikeKey(result);
        if (key === 'columns') {
          const [array] = Array.isArray(result[key])
            ? (result[key] as any[]).filter((item: Record<string, any>) => item && Array.isArray(item.render))
            : [null];
          return array[position];
        }
        return result[key][position];
      }
    } else {
      return result;
    }
  }, vdomTree);
};

const findLastObject = (vdomTree: VDomNode[], indexes: number[]): VDomNode => {
  // hack
  return findNearestParent(vdomTree, [...indexes, 0]) as any;
};

interface useRenderEditableWrapperReturn {
  extraStyleOfRoot: any;
  renderedEditable: JSX.Element | null;
}

interface DragItem {
  type: string;
  id: number;
  indexes: number[];
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

  const ref = useRef<HTMLElement>(null);

  const moveLayoutInSameLevel = useMemo(
    () => (dragIndexes: number[], hoverIndexes: number[]) => {
      if (compareInSameLevel(dragIndexes, hoverIndexes)) {
        const newVdomTree = produce(vdomTree, (draft: VDomNode[]) => {
          const container = findNearestParent(draft, dragIndexes);
          const lastIndex = dragIndexes.length - 1;
          const dragLeapPosition = dragIndexes[lastIndex];
          const dropLeapPosition = hoverIndexes[lastIndex];
          const dragObject = container[dragLeapPosition];
          const dropObject = container[dropLeapPosition];
          container[dragLeapPosition] = dropObject;
          container[dropLeapPosition] = dragObject;
        });
        setVdomTree(newVdomTree);
      } else {
      }
    },
    [vdomTree, setVdomTree],
  );

  const moveLayoutCrossLevel = useMemo(
    () => (direction: Direction, dragIndexes: number[], hoverIndexes: number[]) => {
      const newVdomTree = produce(vdomTree, (draft: VDomNode[]) => {
        const dragContainer = findNearestParent(draft, dragIndexes);
        const dragLastIndex = dragIndexes.length - 1;
        const dragLeapPosition = dragIndexes[dragLastIndex];
        const dragObject = dragContainer[dragLeapPosition];

        console.log(vdomTree, hoverIndexes);
        const dropContainer = findNearestParent(draft, hoverIndexes);
        const dropLastIndex = hoverIndexes.length - 1;
        if (direction === Direction.UP) {
          dropContainer.splice(dropLastIndex, 0, dragObject);
        } else if (direction === Direction.DOWN) {
          dropContainer.splice(dropLastIndex + 1, 0, dragObject);
        }
      });
      setVdomTree(newVdomTree);
    },
    [vdomTree, setVdomTree],
  );

  const moveLayoutToInternal = useMemo(
    () => (dragIndexes: number[], hoverIndexes: number[]) => {
      let validOperate = true;
      const newVdomTree = produce(vdomTree, (draft: VDomNode[]) => {
        const dragContainer = findNearestParent(draft, dragIndexes);
        const dragLastIndex = dragIndexes.length - 1;
        const dragLeapPosition = dragIndexes[dragLastIndex];
        const dragObject = dragContainer[dragLeapPosition];

        const dropObject = findLastObject(draft, hoverIndexes);
        const key = getChildrenLikeKey(dropObject);
        if (Array.isArray(dropObject[key])) {
          validOperate = true;
          dragObject[key].push(dragObject);
        } else {
          validOperate = false;
        }
      });
      if (validOperate) {
        setVdomTree(newVdomTree);
      }
    },
    [vdomTree, setVdomTree],
  );

  const [{ isDragging }, drag] = useDrag({
    type: DnDTypes.UI,
    item: () => ({ id: (vdomNode as VDomNode).id, indexes: vdomNode.hierarchicalRecords }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: DnDTypes.UI,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      const dragIndexes = item.indexes;
      const hoverIndexes = vdomNode.hierarchicalRecords;

      if (equalNumberArray(dragIndexes, hoverIndexes)) {
        return;
      }

      const hoverBoundingRect = (ref.current as HTMLElement).getBoundingClientRect();

      const hoverOneThirdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;

      // 鼠标位置
      const clientOffset = monitor.getClientOffset();

      // 鼠标y距hover目标顶部的距离
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // 仅当鼠标越过项目高度的上下1/3时才执行移动
      // 向下拖动时，仅在光标低于 33% 时移动
      // 向上拖动时，仅在光标高于 33% 时移动
      // 中间区域认为移动至hover目标内部

      const isSameLevel = compareInSameLevel(dragIndexes, hoverIndexes);

      // Dragging downwards
      if (isSameLevel && aOnTopOfB(dragIndexes, hoverIndexes) && hoverClientY < hoverOneThirdY) {
        return;
      }

      // Dragging upwards
      if (isSameLevel && aOnTopOfB(hoverIndexes, dragIndexes) && hoverClientY > hoverOneThirdY) {
        return;
      }

      // Time to actually perform the action
      if (isSameLevel) {
        moveLayoutInSameLevel(dragIndexes, hoverIndexes);
      } else {
        if (hoverClientY > hoverOneThirdY * 2) {
          moveLayoutCrossLevel(Direction.DOWN, dragIndexes, hoverIndexes);
        } else if (hoverClientY < hoverOneThirdY) {
          moveLayoutCrossLevel(Direction.UP, dragIndexes, hoverIndexes);
        } else {
          moveLayoutToInternal(dragIndexes, hoverIndexes);
        }
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.indexes = hoverIndexes;
    },
  });

  drag(drop(ref));

  const opacity = useMemo(() => (isDragging ? 0 : 1), [isDragging]);

  const RenderEditableWrapper = useMemo(() => renderEditableWrapper || (() => null), [renderEditableWrapper]);

  const renderedEditable = useMemo(
    () => <RenderEditableWrapper ref={ref} vdomNode={vdomNode} vdomTree={vdomTree} setVdomTree={setVdomTree} />,
    [RenderEditableWrapper, vdomNode, vdomTree, setVdomTree],
  );

  const extraStyleOfRoot = useMemo(
    () => (renderEditableWrapper ? { position: 'relative', opacity } : {}),
    [renderEditableWrapper, opacity],
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
