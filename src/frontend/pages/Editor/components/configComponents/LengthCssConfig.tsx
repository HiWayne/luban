import { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { InputNumber, Select } from 'antd';
import { isExist } from '@duitang/dt-base';
import { Flex } from '@/frontend/components';
import { LengthUnit } from '../../type';

export const Wrapper = styled.div`
  & .ant-tabs-nav[role='tablist'] {
    margin-bottom: 4px;
  }
  & .ant-tabs-tab {
    padding: 4px 0 !important;
  }
  & .ant-tabs-tab-btn[role='tab'] {
    font-size: 12px;
  }
  & .ant-select-selection-item {
    font-size: 12px !important;
  }
`;

interface ValueWithUnitProps {
  value: number | null;
  setValue: (value: number | null) => void;
  placeholder?: string;
  unitValue: LengthUnit;
  setUnitValue: (unit: LengthUnit) => void;
}

export const ValueWithUnit: FC<ValueWithUnitProps> = ({
  value,
  setValue,
  placeholder,
  unitValue,
  setUnitValue,
}) => {
  const unitOptions: { label: string; value: LengthUnit | '' }[] = useMemo(
    () => [
      {
        label: 'px',
        value: 'px',
      },
      {
        label: 'rem',
        value: 'rem',
      },
      {
        label: 'vw',
        value: 'vw',
      },
      {
        label: 'vh',
        value: 'vh',
      },
      {
        label: '%',
        value: '%',
      },
      {
        label: 'em',
        value: 'em',
      },
      {
        label: '无',
        value: '',
      },
    ],
    [],
  );

  return (
    <Flex>
      <InputNumber
        style={{ width: '130px' }}
        size="small"
        value={value}
        onChange={setValue}
        placeholder={placeholder || '单位在右侧选择'}
      />
      <Select
        size="small"
        style={{ width: '80px' }}
        value={unitValue}
        onChange={setUnitValue}
        options={unitOptions}
      />
    </Flex>
  );
};

export interface LengthStyleConfig {
  value?: number | null;
  unit?: LengthUnit;
}

interface LengthCssConfigProps {
  placeholder?: string;
  defaultValue?: number;
  defaultUnit?: LengthUnit;
  onChange: (
    data: {
      style: string | number;
      styleConfig: LengthStyleConfig;
    } | null,
  ) => void;
}

export const LengthCssConfig: FC<LengthCssConfigProps> = ({
  placeholder,
  defaultValue,
  defaultUnit,
  onChange: _onChange,
}) => {
  const [number, setNumber] = useState<number | null>(
    isExist(defaultValue) ? (defaultValue as number) : null,
  );
  const [unit, setUnit] = useState<LengthUnit>(
    isExist(defaultUnit) ? (defaultUnit as any) : 'px',
  );

  useEffect(() => {
    if (typeof _onChange === 'function') {
      if (number !== null) {
        if (unit) {
          const css = `${number}${unit}`;
          const styleConfig = {
            value: number,
            unit,
          };
          _onChange({ style: css, styleConfig });
        } else {
          const css = number;
          const styleConfig = {
            value: number,
            unit,
          };
          _onChange({ style: css, styleConfig });
        }
      } else {
        _onChange(null);
      }
    }
  }, [number, unit]);

  return (
    <ValueWithUnit
      value={number}
      setValue={setNumber}
      unitValue={unit}
      setUnitValue={setUnit}
      placeholder={placeholder}
    />
  );
};
