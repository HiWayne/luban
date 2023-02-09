import { useContext } from 'react';
import { toCComponents } from '..';
import { ComponentItem, ComponentsSelectArea } from '../../components';
import { DragContext } from '../DragProvider';
import { LightText } from './LightText';
import { Title } from './Title';

export const BasicComponents = () => {
  const { onDragStart, onDragEnd, onDragOver } = useContext(DragContext)!;

  return (
    <>
      <Title>基础组件</Title>
      <LightText>可拖动到指定位置，若点击将在页面末尾添加</LightText>
      <ComponentsSelectArea>
        {toCComponents.map((component) => (
          <ComponentItem
            data={component}
            key={component.name}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          />
        ))}
      </ComponentsSelectArea>
    </>
  );
};
