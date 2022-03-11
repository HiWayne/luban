import styled from '@emotion/styled';
import { Dispatch, FunctionComponent, useState, MutableRefObject, forwardRef, useMemo } from 'react';
import moveIcon from '@creation/images/move.png';
import editIcon from '@creation/images/edit.png';
import deleteIcon from '@creation/images/delete.png';
import { useRef } from 'react';

interface IconProps {
  src: string;
  width?: string;
  height?: string;
  style?: Record<string, string | number>;
  className?: string;
  tip?: string;
  draggable?: boolean;
}

const Icon = styled<FunctionComponent<IconProps>>(({ className, style, tip, ...props }) => (
  <i className={className} style={style} title={tip} {...props}></i>
))`
  display: inline-block;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  width: ${(props) => (props.width ? props.width : '16px')};
  height: ${(props) => (props.height ? props.height : '16px')};
  cursor: pointer;

  &:hover {
    transition: all 0.2s ease-out;
    transform: scale(1.2);
  }
`;

interface OperationAreaProps {
  className?: string;
  vdomTree: VDomNode[];
  showEditable: (e: MouseEvent) => void;
}

const OperationArea = styled<FunctionComponent<OperationAreaProps>>(({ className, vdomTree, showEditable }) => {
  return (
    <div className={className}>
      <Icon src={moveIcon} style={{ marginRight: '4px' }} tip="拖拽移动" />
      <Icon src={editIcon} style={{ marginRight: '4px' }} tip="编辑" />
      <Icon src={deleteIcon} tip="删除" />
    </div>
  );
})`
  position: absolute;
  top: -25px;
  right: 0;
  padding: 4px;
  width: 56px;
  height: 16px;
  box-sizing: content-box;
  background-color: #1890ff;
`;

export enum HighLightPosition {
  TOP = 'TOP',
  CENTER = 'CENTER',
  BOTTOM = 'BOTTOM',
  NONE = 'NONE',
}

export interface EditableWrapperProps {
  className?: string;
  vdomNode: VDomNode | CommonProps;
  vdomTree: VDomNode[];
  setVdomTree: Dispatch<VDomNode[]>;
  highLightPosition: HighLightPosition;
  canInsert: boolean;
  [key: string]: any;
}

// @ts-ignore
const EditableWrapper = styled<FunctionComponent<EditableWrapperProps>>(
  forwardRef<HTMLElement, EditableWrapperProps>(
    ({ className, vdomTree, setVdomTree, vdomNode, highLightPosition, canInsert, ...props }, ref) => {
      const [hover, setHover] = useState(false);
      const timerRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

      const isDragOverHighLight = useMemo(
        () => canInsert && highLightPosition === HighLightPosition.CENTER,
        [canInsert, highLightPosition],
      );

      const isCommonHighLight = useMemo(
        () => hover || (canInsert && highLightPosition === HighLightPosition.CENTER),
        [hover, canInsert, highLightPosition],
      );

      const showEditable = (e: MouseEvent) => {
        if (highLightPosition !== HighLightPosition.NONE) {
          return;
        }
        e.stopPropagation();
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setTimeout(() => {
          setHover(true);
        }, 100);
      };

      const hiddenEditable = (e: MouseEvent) => {
        if (highLightPosition !== HighLightPosition.NONE) {
          return;
        }
        e.stopPropagation();
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setTimeout(() => {
          setHover(false);
        }, 200);
      };

      return (
        <div
          // @ts-ignore
          ref={ref}
          title="拖拽移动"
          className={className}
          style={{
            borderTop: isCommonHighLight ? '1px solid #1890ff' : 'none',
            borderLeft: isCommonHighLight ? '1px solid #1890ff' : 'none',
            borderRight: isCommonHighLight ? '1px solid #1890ff' : 'none',
            borderBottom: isCommonHighLight ? '1px solid #1890ff' : 'none',
            backgroundColor: isCommonHighLight ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
          }}
          {...props}
          // @ts-ignore
          onMouseEnter={showEditable}
          // @ts-ignoreF
          onMouseLeave={hiddenEditable}
        >
          {isDragOverHighLight ? '松开放入内部' : ''}
          {hover ? <OperationArea vdomTree={vdomTree} showEditable={showEditable} /> : null}
        </div>
      );
    },
  ),
)`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: ${(props) =>
    props.vdomNode && props.vdomNode.hierarchicalRecords ? props.vdomNode.hierarchicalRecords.length : 1};
  color: rgba(24, 144, 255, 0.7);
  // 禁止长按选中
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;

  &::before {
    content: '移动到此处';
    display: ${(props) => (props.highLightPosition === HighLightPosition.TOP ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: -10px;
    z-index: 9999;
    width: 100%;
    height: 2px;
    background-color: #1890ff;
  }

  &::after {
    content: '移动到此处';
    display: ${(props) => (props.highLightPosition === HighLightPosition.BOTTOM ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: -10px;
    z-index: 9999;
    width: 100%;
    height: 2px;
    background-color: #1890ff;
  }
`;

export default EditableWrapper;
