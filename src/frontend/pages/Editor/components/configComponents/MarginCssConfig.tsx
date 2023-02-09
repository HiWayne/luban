import { FC, useEffect, useMemo, useState } from 'react';
import { Form, Tabs } from 'antd';
import { isExist } from '@duitang/dt-base';
import { Flex } from '@/frontend/components';
import { ValueWithUnit, Wrapper } from './LengthCssConfig';
import { LengthUnit } from '../../type';

type Tab = 'all' | 'custom';

const TAB_KEYS: { label: string; value: Tab }[] = [
  { label: '所有方向', value: 'all' },
  { label: '自定义方向', value: 'custom' },
];

export interface MarginStyleConfig {
  tab: Tab;
  singleValue?: number;
  singleUnit?: LengthUnit;
  topValue?: number;
  topUnit?: LengthUnit;
  bottomValue?: number;
  bottomUnit?: LengthUnit;
  leftValue?: number;
  leftUnit?: LengthUnit;
  rightValue?: number;
  rightUnit?: LengthUnit;
}

interface MarginCssConfigProps {
  placeholder?: string;
  placeholderOfCustom?: string;
  defaultTab?: Tab;
  defaultValue?: number;
  defaultUnit?: LengthUnit;
  defaultTopValue?: number;
  defaultTopUnit?: LengthUnit;
  defaultBottomValue?: number;
  defaultBottomUnit?: LengthUnit;
  defaultLeftValue?: number;
  defaultLeftUnit?: LengthUnit;
  defaultRightValue?: number;
  defaultRightUnit?: LengthUnit;
  labels?: string[];
  onChange: (
    data: {
      style: string;
      styleConfig: MarginStyleConfig;
    } | null,
  ) => void;
}

interface Direction {
  value: number | null;
  unit: LengthUnit;
}

export const MarginCssConfig: FC<MarginCssConfigProps> = ({
  placeholder,
  placeholderOfCustom,
  defaultTab,
  defaultValue,
  defaultUnit,
  defaultTopValue,
  defaultTopUnit,
  defaultBottomValue,
  defaultBottomUnit,
  defaultLeftValue,
  defaultLeftUnit,
  defaultRightValue,
  defaultRightUnit,
  labels,
  onChange: _onChange,
}) => {
  const [tab, setTab] = useState<Tab>(defaultTab || TAB_KEYS[0].value);
  const [number, setNumber] = useState<number | null>(
    isExist(defaultValue) ? (defaultValue as number) : 0,
  );
  const [numberUnit, setNumberUnit] = useState<LengthUnit>(defaultUnit || 'px');
  const [top, setTop] = useState<Direction>({
    value: isExist(defaultTopValue)
      ? (defaultTopValue as number)
      : tab === 'custom'
      ? 0
      : number,
    unit: defaultTopUnit || 'px',
  });
  const [bottom, setBottom] = useState<Direction>({
    value: isExist(defaultBottomValue)
      ? (defaultBottomValue as number)
      : tab === 'custom'
      ? 0
      : number,
    unit: defaultBottomUnit || 'px',
  });
  const [left, setLeft] = useState<Direction>({
    value: isExist(defaultLeftValue)
      ? (defaultLeftValue as number)
      : tab === 'custom'
      ? 0
      : number,
    unit: defaultLeftUnit || 'px',
  });
  const [right, setRight] = useState<Direction>({
    value: isExist(defaultRightValue)
      ? (defaultRightValue as number)
      : tab === 'custom'
      ? 0
      : number,
    unit: defaultRightUnit || 'px',
  });

  useEffect(() => {
    if (typeof _onChange === 'function') {
      if (tab === TAB_KEYS[0].value) {
        if (number) {
          const css = `${number}${numberUnit}`;
          const marginStyleConfig: MarginStyleConfig = {
            tab,
            singleValue: number,
            singleUnit: numberUnit,
          };
          _onChange({ style: css, styleConfig: marginStyleConfig });
        } else {
          _onChange(null);
        }
      } else {
        const css = `${top.value || 0}${top.unit} ${right.value || 0}${
          right.unit
        } ${bottom.value || 0}${bottom.unit} ${left.value}${left.unit}`;
        const marginStyleConfig: MarginStyleConfig = {
          tab,
          topValue: top.value || 0,
          topUnit: top.unit,
          bottomValue: bottom.value || 0,
          bottomUnit: bottom.unit,
          leftValue: left.value || 0,
          leftUnit: left.unit,
          rightValue: right.value || 0,
          rightUnit: right.unit,
        };
        _onChange({ style: css, styleConfig: marginStyleConfig });
      }
    }
  }, [tab, number, numberUnit, top, bottom, left, right]);

  const items: { label: string; key: Tab; children: JSX.Element }[] = useMemo(
    () => [
      {
        label: TAB_KEYS[0].label,
        key: TAB_KEYS[0].value,
        children: (
          <ValueWithUnit
            value={number || 0}
            setValue={setNumber}
            unitValue={numberUnit}
            setUnitValue={setNumberUnit}
            placeholder={placeholder}
          />
        ),
      },
      {
        label: TAB_KEYS[1].label,
        key: TAB_KEYS[1].value,
        children: (
          <Flex wrap>
            <Form.Item label={(labels && labels[0]) || '上边距'}>
              <ValueWithUnit
                value={top.value}
                setValue={(value) => setTop((data) => ({ ...data, value }))}
                unitValue={top.unit}
                setUnitValue={(unit) => setTop((data) => ({ ...data, unit }))}
                placeholder={placeholderOfCustom}
              />
            </Form.Item>
            <Form.Item label={(labels && labels[1]) || '右边距'}>
              <ValueWithUnit
                value={right.value}
                setValue={(value) => setRight((data) => ({ ...data, value }))}
                unitValue={right.unit}
                setUnitValue={(unit) => setRight((data) => ({ ...data, unit }))}
                placeholder={placeholderOfCustom}
              />
            </Form.Item>
            <Form.Item label={(labels && labels[2]) || '下边距'}>
              <ValueWithUnit
                value={bottom.value}
                setValue={(value) => setBottom((data) => ({ ...data, value }))}
                unitValue={bottom.unit}
                setUnitValue={(unit) =>
                  setBottom((data) => ({ ...data, unit }))
                }
                placeholder={placeholderOfCustom}
              />
            </Form.Item>
            <Form.Item label={(labels && labels[3]) || '左边距'}>
              <ValueWithUnit
                value={left.value}
                setValue={(value) => setLeft((data) => ({ ...data, value }))}
                unitValue={left.unit}
                setUnitValue={(unit) => setLeft((data) => ({ ...data, unit }))}
                placeholder={placeholderOfCustom}
              />
            </Form.Item>
          </Flex>
        ),
      },
    ],
    [number, numberUnit, top, bottom, left, right],
  );

  return (
    <Wrapper>
      <Tabs
        defaultActiveKey={tab}
        style={{ width: '240px' }}
        size="small"
        tabBarGutter={8}
        items={items}
        onChange={setTab as any}
      />
    </Wrapper>
  );
};
