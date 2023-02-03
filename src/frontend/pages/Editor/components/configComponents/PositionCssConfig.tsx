import { CSSProperties, FC, useEffect, useState } from 'react';
import { Form, InputNumber, Select } from 'antd';
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
  defaultLeft?: number | null;
  defaultLeftUnit?: LengthUnit;
  defaultTop?: number | null;
  defaultTopUnit?: LengthUnit;
  defaultRight?: number | null;
  defaultRightUnit?: LengthUnit;
  defaultBottom?: number | null;
  defaultBottomUnit?: LengthUnit;
  defaultZIndex?: number;
  onChange: (
    data: {
      styleConfig: PositionStyleConfig;
      style: CSSProperties;
    } | null,
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
  defaultZIndex,
  onChange,
}) => {
  const [position, setPosition] = useState<PositionType>(
    defaultPosition || 'static',
  );
  const [left, setLeft] = useState<number | null>(
    defaultLeft === undefined ? null : defaultLeft,
  );
  const [leftUnit, setLeftUnit] = useState(defaultLeftUnit || 'px');
  const [top, setTop] = useState<number | null>(
    defaultTop === undefined ? null : defaultTop,
  );
  const [topUnit, setTopUnit] = useState(defaultTopUnit || 'px');
  const [right, setRight] = useState<number | null>(
    defaultRight === undefined ? null : defaultRight,
  );
  const [rightUnit, setRightUnit] = useState(defaultRightUnit || 'px');
  const [bottom, setBottom] = useState<number | null>(
    defaultBottom === undefined ? null : defaultBottom,
  );
  const [bottomUnit, setBottomUnit] = useState(defaultBottomUnit || 'px');
  const [zIndex, setZIndex] = useState(
    defaultZIndex === undefined ? null : defaultZIndex,
  );

  useEffect(() => {
    if (typeof onChange === 'function') {
      if (position === 'static') {
        onChange(null);
      } else {
        const positionStyle: CSSProperties = {
          position,
        };
        if (left !== null) {
          positionStyle.left = `${left || 0}${leftUnit}`;
        } else {
          positionStyle.left = 'unset';
        }
        if (right !== null) {
          positionStyle.right = `${right || 0}${rightUnit}`;
        } else {
          positionStyle.right = 'unset';
        }
        if (top !== null) {
          positionStyle.top = `${top || 0}${topUnit}`;
        } else {
          positionStyle.top = 'unset';
        }
        if (bottom !== null) {
          positionStyle.bottom = `${bottom || 0}${bottomUnit}`;
        } else {
          positionStyle.bottom = 'unset';
        }
        if (zIndex !== null) {
          positionStyle.zIndex = zIndex;
        } else {
          positionStyle.zIndex = 'unset';
        }
        const positionStyleConfig: PositionStyleConfig = {
          type: position,
        };
        positionStyleConfig.leftValue = left;
        positionStyleConfig.leftUnit = leftUnit;
        positionStyleConfig.rightValue = right;
        positionStyleConfig.rightUnit = rightUnit;
        positionStyleConfig.topValue = top;
        positionStyleConfig.topUnit = topUnit;
        positionStyleConfig.bottomValue = bottom;
        positionStyleConfig.bottomUnit = bottomUnit;
        positionStyleConfig.zIndex = zIndex;

        onChange({ styleConfig: positionStyleConfig, style: positionStyle });
      }
    }
  }, [
    position,
    left,
    leftUnit,
    top,
    topUnit,
    right,
    rightUnit,
    bottom,
    bottomUnit,
    zIndex,
  ]);

  return (
    <Flex direction="column" alignItems="flex-start">
      <Form.Item label="定位类型">
        <Select
          style={{ width: '100px' }}
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
      <Form.Item label="z-index">
        <InputNumber
          style={{ width: '100px' }}
          value={zIndex}
          onChange={setZIndex}
        />
      </Form.Item>
    </Flex>
  );
};
