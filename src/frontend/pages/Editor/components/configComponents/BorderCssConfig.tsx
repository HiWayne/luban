import { CSSProperties, FC, useCallback, useEffect, useState } from 'react';
import { Select } from 'antd';
import { Flex } from '@/frontend/components';
import { ColorPicker } from './ColorPicker';
import { ValueWithUnit } from './LengthCssConfig';
import { BorderStyle, LengthUnit } from '../../type';
import { BorderStyleConfig } from './CustomStyleConfig';

const options: { label: string; value: BorderStyle }[] = [
  {
    label: '实线',
    value: 'solid',
  },
  {
    label: '线段虚线',
    value: 'dashed',
  },
  {
    label: '圆点虚线',
    value: 'dotted',
  },
  {
    label: '双实线',
    value: 'double',
  },
];

interface BorderCssConfigProps {
  defaultBorderWidth?: number;
  defaultBorderWidthUnit?: LengthUnit;
  defaultBorderStyle?: BorderStyle;
  defaultBorderColor?: string;
  onChange: (
    data: {
      styleConfig: BorderStyleConfig;
      style: CSSProperties;
    } | null,
  ) => void;
}

export const BorderCssConfig: FC<BorderCssConfigProps> = ({
  defaultBorderColor,
  defaultBorderStyle,
  defaultBorderWidth,
  defaultBorderWidthUnit,
  onChange,
}) => {
  const [borderWidth, setBorderWidth] = useState<number | null>(
    defaultBorderWidth || null,
  );
  const [borderWidthUnit, setBorderWidthUnit] = useState(
    defaultBorderWidthUnit || 'px',
  );
  const [borderStyle, setBorderStyle] = useState(defaultBorderStyle || 'solid');
  const [borderColor, setBorderColor] = useState<string>(
    defaultBorderColor || 'transparent',
  );

  useEffect(() => {
    if (typeof onChange === 'function') {
      if (borderWidth !== 0 && borderWidth !== null) {
        const borderStyleObj = {
          border: `${borderWidth}${borderWidthUnit} ${borderStyle} ${borderColor}`,
        };
        const borderStyleConfig = {
          borderWidthValue: borderWidth,
          borderWidthUnit,
          borderStyle,
          borderColor,
        };
        onChange({ styleConfig: borderStyleConfig, style: borderStyleObj });
      } else {
        onChange(null);
      }
    }
  }, [borderWidth, borderWidthUnit, borderStyle, borderColor]);

  const handleColorPickerChange = useCallback((color: string | null) => {
    if (color === null) {
      setBorderColor('transparent');
    } else {
      setBorderColor(color);
    }
  }, []);

  return (
    <Flex>
      <ValueWithUnit
        value={borderWidth}
        setValue={setBorderWidth}
        unitValue={borderWidthUnit}
        setUnitValue={setBorderWidthUnit}
      />
      <Select
        defaultValue={borderStyle}
        options={options}
        onChange={setBorderStyle}
      />
      <ColorPicker
        defaultColor={borderColor}
        onChange={handleColorPickerChange}
      />
    </Flex>
  );
};
