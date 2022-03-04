import styled from '@emotion/styled';
import { Dispatch, FunctionComponent, useState, MutableRefObject, forwardRef, RefObject } from 'react';
import { useDrag } from 'react-dnd';
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
  width: ${(props) => (props.width ? props.width : '20px')};
  height: ${(props) => (props.height ? props.height : '20px')};
  cursor: pointer;

  &:hover {
    transition: all 0.2s ease-out;
    transform: scale(1.2);
  }
`;

interface OperationAreaProps {
  className?: string;
  vdomTree: VDomNode[];
  showEditable: () => void;
}

const OperationArea = styled<FunctionComponent<OperationAreaProps>>(({ className, vdomTree, showEditable }) => {
  return (
    <div className={className}>
      <Icon src={moveIcon} style={{ marginRight: '5px' }} tip="拖拽移动" />
      <Icon src={editIcon} style={{ marginRight: '5px' }} tip="编辑" />
      <Icon src={deleteIcon} tip="删除" />
    </div>
  );
})`
  position: absolute;
  top: -27px;
  right: 0;
  padding: 3px 5px;
  width: 70px;
  height: 20px;
  box-sizing: content-box;
  background-color: #1890ff;
`;

export interface EditableWrapperProps {
  className?: string;
  vdomNode: VDomNode | CommonProps;
  vdomTree: VDomNode[];
  setVdomTree: Dispatch<VDomNode[]>;
  [key: string]: any;
}

// @ts-ignore
const EditableWrapper = styled<FunctionComponent<EditableWrapperProps>>(
  forwardRef<HTMLElement, EditableWrapperProps>(({ className, vdomTree, setVdomTree, vdomNode, ...props }, ref) => {
    const [editable, setEditable] = useState(false);
    const timerRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

    const showEditable = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setEditable(true);
    };

    const hiddenEditable = () => {
      timerRef.current = setTimeout(() => {
        setEditable(false);
      }, 300);
    };

    return (
      <div
        // @ts-ignore
        ref={ref}
        title="拖拽移动"
        className={className}
        style={{
          border: editable ? '1px solid #1890ff' : 'none',
          backgroundColor: editable ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        }}
        {...props}
        onMouseEnter={showEditable}
        onMouseLeave={hiddenEditable}
      >
        {editable ? <OperationArea vdomTree={vdomTree} showEditable={showEditable} /> : null}
      </div>
    );
  }),
)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  // 禁止长按选中
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
`;

export default EditableWrapper;
