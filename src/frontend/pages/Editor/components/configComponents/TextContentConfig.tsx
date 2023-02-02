import { Input, Tabs } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';

const TAB_KEYS = [
  {
    label: '静态文字',
    value: 'static',
  },
  {
    label: '变量',
    value: 'variable',
  },
];

type Tab = 'static' | 'variable';

export interface TextContentStyleConfig {
  tab: Tab;
  text: string;
}

interface TextContentConfigProps {
  defaultTab?: Tab;
  defaultText?: string;
  onChange: (
    data: {
      style: string;
      styleConfig: TextContentStyleConfig;
    } | null,
  ) => void;
}

export const TextContentConfig: FC<TextContentConfigProps> = ({
  defaultTab,
  defaultText,
  onChange,
}) => {
  const [tab, setTab] = useState<Tab>(defaultTab || 'static');
  const [text, setText] = useState(defaultText || '');

  useEffect(() => {
    if (tab === 'static') {
      const style = text || '';
      const styleConfig = {
        tab,
        text,
      };
      onChange({ style, styleConfig });
    }
  }, [tab, text]);

  const items = useMemo(
    () => [
      {
        label: TAB_KEYS[0].label,
        key: TAB_KEYS[0].value,
        children: (
          <Input
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
          />
        ),
      },
      {
        label: TAB_KEYS[1].label,
        key: TAB_KEYS[1].value,
        children: 'TODO',
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
