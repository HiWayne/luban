import { Tabs } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { UploadImageConfig } from './UploadImageConfig';

const TAB_KEYS = [
  {
    label: '静态图片',
    value: 'static',
  },
  {
    label: '变量',
    value: 'variable',
  },
];

type Tab = 'static' | 'variable';

export interface ImageSrcStyleConfig {
  tab: Tab;
  src: string;
}

interface ImageSrcConfigProps {
  defaultTab?: Tab;
  defaultSrc?: string;
  onChange: (
    data: {
      style: string;
      styleConfig: ImageSrcStyleConfig;
    } | null,
  ) => void;
}

export const ImageSrcConfig: FC<ImageSrcConfigProps> = ({
  defaultTab,
  defaultSrc,
  onChange,
}) => {
  const [tab, setTab] = useState<Tab>(defaultTab || 'static');
  const [src, setSrc] = useState(defaultSrc || '');

  useEffect(() => {
    if (tab === 'static') {
      if (src) {
        const style = src;
        const styleConfig = {
          tab,
          src,
        };
        onChange({ style, styleConfig });
      }
    }
  }, [tab, src]);

  const items = useMemo(
    () => [
      {
        label: TAB_KEYS[0].label,
        key: TAB_KEYS[0].value,
        children: <UploadImageConfig defaultUrl={src} onChange={setSrc} />,
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
