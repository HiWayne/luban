import { FC, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { InboxOutlined } from '@ant-design/icons';
import { ToCComponent } from '@/backend/service/compileService/generateReactSourceCode/generateFrontstageCode/toCComponentsPluginsConfig';
import { useEditorInteractive } from '../../../hooks';

const Dragger = styled.div`
  margin: 0 0 20px 0;
  padding: 16px 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 120px;
  text-align: center;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
  box-sizing: border-box;
`;

interface AddDropAreaProps {
  id: number;
  onDrop: any;
}

export const AddDropArea: FC<AddDropAreaProps> = ({ id, onDrop }) => {
  const draggerRef = useRef<HTMLDivElement>(null);

  const { onDragOver } = useEditorInteractive(1);

  const handleDrop = useCallback(
    function (this: HTMLElement, event: DragEvent) {
      return onDrop.call(this, event, id);
    },
    [id],
  );

  useEffect(() => {
    if (draggerRef.current) {
      draggerRef.current.addEventListener('drop', handleDrop);
      draggerRef.current.addEventListener('dragover', onDragOver);
      return () => {
        draggerRef.current?.removeEventListener('drop', handleDrop);
        draggerRef.current?.removeEventListener('dragover', onDragOver);
      };
    }
  }, [handleDrop]);

  return (
    <Dragger ref={draggerRef} draggable>
      <p style={{ marginBottom: '16px' }}>
        <InboxOutlined style={{ color: '#1677ff', fontSize: '48px' }} />
      </p>
      <p
        style={{
          marginBottom: '4px',
          color: 'rgba(0,0,0,.88)',
          fontSize: '16px',
        }}>
        将子组件拖入这里也可添加
      </p>
    </Dragger>
  );
};
