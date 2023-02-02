import { FC, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import { useModifyPage } from '../hooks';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  border: 1px solid #e3e6eb;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 0 8px;
`;

const Name = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #13161b;
  cursor: grab;
`;

// const Image = styled.img`
//     width: 16px;
//     height: 16px;
//     margin-right: 8px;
// `

interface ComponentItemProp {
  data: ToCComponent;
  onDragStart: any;
  onDragOver: any;
  onDragEnd: any;
}

export const ComponentItem: FC<ComponentItemProp> = ({
  data,
  onDragStart: _onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { name } = data;

  const { addComponentFromInitial } = useModifyPage();

  const onDragStart = useCallback(function (
    this: HTMLElement,
    event: DragEvent,
  ) {
    return _onDragStart.call(this, event, data);
  },
  []);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener('dragstart', onDragStart);
      wrapperRef.current.addEventListener('dragover', onDragOver);
      wrapperRef.current.addEventListener('dragend', onDragEnd);

      return () => {
        wrapperRef.current?.removeEventListener('dragstart', onDragStart);
        wrapperRef.current?.removeEventListener('dragover', onDragOver);
        wrapperRef.current?.removeEventListener('dragend', onDragEnd);
      };
    }
  }, []);

  return (
    <Wrapper
      ref={wrapperRef}
      draggable
      onClick={() => addComponentFromInitial(data)}>
      {/* <Image src={icon} alt="小图标" /> */}
      <Name>{name}</Name>
    </Wrapper>
  );
};
