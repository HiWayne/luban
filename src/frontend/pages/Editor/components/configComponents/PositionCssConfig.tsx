import { CSSProperties, FC, useEffect, useState } from 'react';
import { Form, Select } from 'antd';
import { Flex } from '@/frontend/components';
import { ValueWithUnit } from './LengthCssConfig';
import { LengthUnit, PositionType } from '../../type';
import { PositionStyleConfig } from './CustomStyleConfig';

const options = [
  {
    label: '不定位',
    value: 'static',
  },
  {
    label: '绝对定位',
    value: 'absolute',
  },
  {
    label: '相对定位',
    value: 'relative',
  },
  {
    label: '粘滞定位',
    value: 'sticky',
  },
];

interface PositionCssConfigProps {
  defaultPosition?: PositionType;
  defaultLeft?: number;
  defaultLeftUnit?: LengthUnit;
  defaultTop?: number;
  defaultTopUnit?: LengthUnit;
  defaultRight?: number;
  defaultRightUnit?: LengthUnit;
  defaultBottom?: number;
  defaultBottomUnit?: LengthUnit;
  onChange: (
    data:
      | {
          styleConfig: PositionStyleConfig;
          style: CSSProperties;
        }
      | string[],
  ) => void;
}

export const PositionCssConfig: FC<PositionCssConfigProps> = ({
  defaultPosition,
  defaultLeft,
  defaultLeftUnit,
  defaultTop,
  defaultTopUnit,
  defaultRight,
  defaultRightUnit,
  defaultBottom,
  defaultBottomUnit,
  onChange,
}) => {
  const [position, setPosition] = useState<PositionType>(
    defaultPosition || 'static',
  );
  const [left, setLeft] = useState<number | null>(defaultLeft || 0);
  const [leftUnit, setLeftUnit] = useState(defaultLeftUnit || 'px');
  const [top, setTop] = useState<number | null>(defaultTop || 0);
  const [topUnit, setTopUnit] = useState(defaultTopUnit || 'px');
  const [right, setRight] = useState<number | null>(defaultRight || 0);
  const [rightUnit, setRightUnit] = useState(defaultRightUnit || 'px');
  const [bottom, setBottom] = useState<number | null>(defaultBottom || 0);
  const [bottomUnit, setBottomUnit] = useState(defaultBottomUnit || 'px');

  useEffect(() => {
    if (typeof onChange === 'function') {
      if (position === 'static') {
        onChange(['position', 'left', 'right', 'top', 'bottom']);
      } else {
        const positionStyle: CSSProperties = {
          position,
          top: `${top || 0}${topUnit}`,
          left: `${left || 0}${leftUnit}`,
        };
        if (left !== null) {
          positionStyle.left = `${left || 0}${leftUnit}`;
        }
        if (right !== null) {
          positionStyle.right = `${right || 0}${rightUnit}`;
        }
        if (top !== null) {
          positionStyle.top = `${top || 0}${topUnit}`;
        }
        if (bottom !== null) {
          positionStyle.bottom = `${bottom || 0}${bottomUnit}`;
        }
        const positionStyleConfig: PositionStyleConfig = {
          type: position,
        };
        if (left !== null) {
          positionStyleConfig.leftValue = left;
          positionStyleConfig.leftUnit = leftUnit;
        }
        if (right !== null) {
          positionStyleConfig.rightValue = right;
          positionStyleConfig.rightUnit = rightUnit;
        }
        if (top !== null) {
          positionStyleConfig.topValue = top;
          positionStyleConfig.topUnit = topUnit;
        }
        if (bottom !== null) {
          positionStyleConfig.bottomValue = bottom;
          positionStyleConfig.bottomUnit = bottomUnit;
        }
        onChange({ styleConfig: positionStyleConfig, style: positionStyle });
      }
    }
  }, [position, left, leftUnit, top, topUnit]);

  return (
    <Flex direction="column" alignItems="flex-start">
      <Form.Item label="定位类型">
        <Select
          defaultValue={position}
          options={options}
          onChange={setPosition}
        />
      </Form.Item>
      <Form.Item label="left">
        <ValueWithUnit
          value={left}
          setValue={setLeft}
          unitValue={leftUnit}
          setUnitValue={setLeftUnit}
        />
      </Form.Item>
      <Form.Item label="top">
        <ValueWithUnit
          value={top}
          setValue={setTop}
          unitValue={topUnit}
          setUnitValue={setTopUnit}
        />
      </Form.Item>
      <Form.Item label="right">
        <ValueWithUnit
          value={right}
          setValue={setRight}
          unitValue={rightUnit}
          setUnitValue={setRightUnit}
        />
      </Form.Item>
      <Form.Item label="bottom">
        <ValueWithUnit
          value={bottom}
          setValue={setBottom}
          unitValue={bottomUnit}
          setUnitValue={setBottomUnit}
        />
      </Form.Item>
    </Flex>
  );
};
