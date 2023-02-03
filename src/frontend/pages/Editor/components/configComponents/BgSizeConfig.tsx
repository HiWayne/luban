import { Form, Select, Tabs } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { LengthUnit } from '../../type';
import { ValueWithUnit } from './LengthCssConfig';

const TAB_KEYS = [
  {
    label: '快捷设置',
    value: 'simple',
  },
  {
    label: '自定义大小',
    value: 'custom',
  },
];

const options = [
  {
    label: '铺满',
    value: 'cover',
  },
  {
    label: '完整展示',
    value: 'contain',
  },
];

type Tab = 'simple' | 'custom';

export interface BgSizeStyleConfig {
  tab?: Tab;
  simpleSize?: string;
  customWidth?: number | null;
  customHeight?: number | null;
  customWidthUnit?: LengthUnit;
  customHeightUnit?: LengthUnit;
}

interface BgSizeConfigProps {
  defaultTab?: Tab;
  defaultSimpleSize?: string;
  defaultCustomWidth?: number | null;
  defaultCustomHeight?: number | null;
  defaultCustomWidthUnit?: LengthUnit;
  defaultCustomHeightUnit?: LengthUnit;
  onChange: (
    data: {
      style: string;
      styleConfig: BgSizeStyleConfig;
    } | null,
  ) => void;
}

export const BgSizeConfig: FC<BgSizeConfigProps> = ({
  defaultTab,
  defaultSimpleSize,
  defaultCustomWidth,
  defaultCustomWidthUnit,
  defaultCustomHeight,
  defaultCustomHeightUnit,
  onChange,
}) => {
  const [tab, setTab] = useState<Tab>(defaultTab || 'simple');
  const [simpleSize, setSimpleSize] = useState(defaultSimpleSize || '');
  const [customWidth, setCustomWidth] = useState<number | null>(
    defaultCustomWidth || null,
  );
  const [customWidthUnit, setCustomWidthUnit] = useState(
    defaultCustomWidthUnit || 'px',
  );
  const [customHeight, setCustomHeight] = useState<number | null>(
    defaultCustomHeight || null,
  );
  const [customHeightUnit, setCustomHeightUnit] = useState(
    defaultCustomHeightUnit || 'px',
  );

  useEffect(() => {
    if (tab === 'simple') {
      if (simpleSize) {
        const style = simpleSize;
        const styleConfig = {
          tab,
          simpleSize,
        };
        onChange({ style, styleConfig });
      }
    } else if (tab === 'custom') {
      let style = '';
      if (customWidth) {
        style = `${customWidth}${customWidthUnit}`;
      }
      if (customHeight) {
        style += ` ${customHeight}${customHeightUnit}`;
      }
      const styleConfig = {
        tab,
        customWidth,
        customWidthUnit,
        customHeight,
        customHeightUnit,
      };
      onChange({ style, styleConfig });
    }
  }, [
    tab,
    simpleSize,
    customWidth,
    customWidthUnit,
    customHeight,
    customHeightUnit,
  ]);

  const items = useMemo(
    () => [
      {
        label: TAB_KEYS[0].label,
        key: TAB_KEYS[0].value,
        children: (
          <Select
            defaultValue={simpleSize}
            options={options}
            onChange={setSimpleSize}
          />
        ),
      },
      {
        label: TAB_KEYS[1].label,
        key: TAB_KEYS[1].value,
        children: (
          <Form>
            <Form.Item label="长">
              <ValueWithUnit
                value={customWidth}
                setValue={setCustomWidth}
                unitValue={customWidthUnit}
                setUnitValue={setCustomWidthUnit}
              />
            </Form.Item>
            <Form.Item label="宽">
              <ValueWithUnit
                value={customHeight}
                setValue={setCustomHeight}
                unitValue={customHeightUnit}
                setUnitValue={setCustomHeightUnit}
              />
            </Form.Item>
          </Form>
        ),
      },
    ],
    [],
  );

  return (
    <Tabs
      defaultActiveKey={tab}
      size="small"
      tabBarGutter={8}
      items={items}
      onChange={setTab as any}
    />
  );
};
