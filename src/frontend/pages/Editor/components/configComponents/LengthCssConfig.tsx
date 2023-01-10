import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { InputNumber, Select, Tabs } from 'antd';
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
  const unitOptions: { label: string; value: LengthUnit }[] = useMemo(
    () => [
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
        label: 'px',
        value: 'px',
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
        style={{ width: '60px' }}
        value={unitValue}
        onChange={setUnitValue}
        options={unitOptions}
      />
    </Flex>
  );
};

type Tab = 'px' | 'custom';

export interface LengthStyleConfig {
  tab?: Tab;
  value?: number | null;
  unit?: LengthUnit;
}

interface LengthCssConfigProps {
  placeholder?: string;
  placeholderOfCustomUnit?: string;
  defaultTab?: Tab;
  defaultValue?: number;
  defaultUnit?: LengthUnit;
  onChange: (
    data: {
      style: string;
      styleConfig: LengthStyleConfig;
    } | null,
  ) => void;
}

const TAB_KEYS: Tab[] = ['px', 'custom'];

export const LengthCssConfig: FC<LengthCssConfigProps> = ({
  placeholder,
  placeholderOfCustomUnit,
  defaultTab,
  defaultValue,
  defaultUnit,
  onChange: _onChange,
}) => {
  const [tab, setTab] = useState<Tab>(defaultTab || TAB_KEYS[0]);
  const [number, setNumber] = useState<number | null>(
    isExist(defaultValue) ? (defaultValue as number) : null,
  );
  const [unit, setUnit] = useState<LengthUnit>(
    tab === 'custom' ? defaultUnit || 'px' : 'px',
  );

  useEffect(() => {
    if (tab === TAB_KEYS[0] && unit !== 'px') {
      setUnit('px');
    }
  }, [tab, unit]);

  const onChange = useCallback(
    (value: number | null) => {
      setNumber(value);
      if (typeof _onChange === 'function') {
        if (value !== null) {
          const css = `${value}${unit}`;
          const styleConfig = {
            tab,
            value: number,
            unit,
          };
          _onChange({ style: css, styleConfig });
        } else {
          _onChange(null);
        }
      }
    },
    [unit],
  );

  const items = useMemo(
    () => [
      {
        label: 'px单位',
        key: TAB_KEYS[0],
        children: (
          <InputNumber
            style={{ width: '145px' }}
            size="small"
            value={number}
            onChange={onChange}
            placeholder={placeholder || '填入数字，单位px'}
          />
        ),
      },
      {
        label: '自定义单位',
        key: TAB_KEYS[1],
        children: (
          <ValueWithUnit
            value={number}
            setValue={onChange}
            unitValue={unit}
            setUnitValue={setUnit}
            placeholder={placeholderOfCustomUnit}
          />
        ),
      },
    ],
    [number, unit],
  );

  return (
    <Wrapper>
      <Tabs
        style={{ width: '200px' }}
        size="small"
        tabBarGutter={8}
        items={items}
        onChange={setTab as any}
      />
    </Wrapper>
  );
};
