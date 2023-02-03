import { Button, Form, List } from 'antd';
import {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BorderStyle, LengthUnit, PositionType } from '../../type';
import { BorderCssConfig } from './BorderCssConfig';
import { PositionCssConfig } from './PositionCssConfig';

export interface PositionStyleConfig {
  type: PositionType;
  leftValue?: number | null;
  leftUnit?: LengthUnit;
  rightValue?: number | null;
  rightUnit?: LengthUnit;
  topValue?: number | null;
  topUnit?: LengthUnit;
  bottomValue?: number | null;
  bottomUnit?: LengthUnit;
  zIndex?: number | null;
}

export interface BorderStyleConfig {
  borderWidthValue: number;
  borderWidthUnit: LengthUnit;
  borderStyle: BorderStyle;
  borderColor: string;
}

export interface CustomStyleConfigData {
  open?: boolean;
  positionStyleConfig?: PositionStyleConfig;
  borderStyleConfig?: BorderStyleConfig;
}

interface CustomStyleConfigProps {
  defaultOpen?: boolean;
  defaultStyleConfig?: CustomStyleConfigData;
  onChange: (data: {
    style: CSSProperties;
    styleConfig: CustomStyleConfigData;
  }) => void;
}

export const CustomStyleConfig: FC<CustomStyleConfigProps> = ({
  defaultOpen,
  defaultStyleConfig,
  onChange,
}) => {
  const [styleConfig, setStyleConfig] = useState<CustomStyleConfigData | null>(
    defaultStyleConfig || null,
  );
  const [style, setStyle] = useState<CSSProperties | null>(null);

  useEffect(() => {
    if (typeof onChange === 'function' && style && styleConfig) {
      onChange({
        style,
        styleConfig:
          styleConfig.borderStyleConfig || styleConfig.positionStyleConfig
            ? { ...styleConfig, open: true }
            : styleConfig,
      });
    }
  }, [style, styleConfig]);

  const RenderBorder = useCallback(() => {
    return (
      <Form.Item label="边框">
        <BorderCssConfig
          defaultBorderWidth={styleConfig?.borderStyleConfig?.borderWidthValue}
          defaultBorderWidthUnit={
            styleConfig?.borderStyleConfig?.borderWidthUnit
          }
          defaultBorderStyle={styleConfig?.borderStyleConfig?.borderStyle}
          defaultBorderColor={styleConfig?.borderStyleConfig?.borderColor}
          onChange={(data) => {
            if (data) {
              const { styleConfig: borderStyleConfig, style: borderStyle } =
                data;
              setStyleConfig((oldStyleConfig) => ({
                ...oldStyleConfig,
                borderStyleConfig,
              }));
              setStyle((oldStyle) => ({ ...oldStyle, ...borderStyle }));
            } else {
              setStyleConfig((oldStyleConfig) => {
                if (oldStyleConfig) {
                  const newStyleConfig = { ...oldStyleConfig };
                  if (newStyleConfig.borderStyleConfig) {
                    delete newStyleConfig.borderStyleConfig;
                  }
                  return newStyleConfig;
                } else {
                  return oldStyleConfig;
                }
              });
              setStyle((oldStyle) => {
                if (oldStyle) {
                  const newStyleObj = { ...oldStyle };
                  if (newStyleObj.border) {
                    delete newStyleObj.border;
                  }
                  return newStyleObj;
                } else {
                  return oldStyle;
                }
              });
            }
          }}
        />
      </Form.Item>
    );
  }, []);

  const RenderPosition = useCallback(() => {
    return (
      <Form.Item label="定位">
        <PositionCssConfig
          defaultPosition={styleConfig?.positionStyleConfig?.type}
          defaultTop={styleConfig?.positionStyleConfig?.topValue}
          defaultTopUnit={styleConfig?.positionStyleConfig?.topUnit}
          defaultLeft={styleConfig?.positionStyleConfig?.leftValue}
          defaultLeftUnit={styleConfig?.positionStyleConfig?.leftUnit}
          defaultRight={styleConfig?.positionStyleConfig?.rightValue}
          defaultRightUnit={styleConfig?.positionStyleConfig?.rightUnit}
          defaultBottom={styleConfig?.positionStyleConfig?.bottomValue}
          defaultBottomUnit={styleConfig?.positionStyleConfig?.bottomUnit}
          onChange={(data) => {
            if (data) {
              const { style: positionStyle, styleConfig: positionStyleConfig } =
                data;
              setStyleConfig((oldStyleConfig) =>
                oldStyleConfig
                  ? {
                      ...oldStyleConfig,
                      positionStyleConfig: {
                        ...positionStyleConfig,
                      },
                    }
                  : { positionStyleConfig: { ...positionStyleConfig } },
              );
              setStyle((oldStyleObj) => ({
                ...oldStyleObj,
                ...positionStyle,
              }));
            } else {
              setStyleConfig((oldStyleConfig) => {
                if (oldStyleConfig) {
                  const newStyleCOnfig = { ...oldStyleConfig };
                  if (newStyleCOnfig.positionStyleConfig) {
                    delete newStyleCOnfig.positionStyleConfig;
                  }
                  return newStyleCOnfig;
                } else {
                  return oldStyleConfig;
                }
              });
              setStyle((oldStyleObj) => {
                if (oldStyleObj) {
                  const newStyleObj = { ...oldStyleObj };
                  if (newStyleObj.position) {
                    delete newStyleObj.position;
                  }
                  if (newStyleObj.left !== undefined) {
                    delete newStyleObj.left;
                  }
                  if (newStyleObj.top !== undefined) {
                    delete newStyleObj.top;
                  }
                  if (newStyleObj.right !== undefined) {
                    delete newStyleObj.right;
                  }
                  if (newStyleObj.bottom !== undefined) {
                    delete newStyleObj.bottom;
                  }
                  return newStyleObj;
                } else {
                  return oldStyleObj;
                }
              });
            }
          }}
        />
      </Form.Item>
    );
  }, []);

  const data = useMemo(
    () => [
      {
        type: 'position',
        render: <RenderPosition />,
      },
      {
        type: 'border',
        render: <RenderBorder />,
      },
    ],
    [],
  );

  const [list, setList] = useState<{ type: string; render: JSX.Element }[]>(
    defaultOpen ? data : [],
  );

  const show = useCallback(() => {
    setList(data);
  }, []);

  const hidden = useCallback(() => {
    setList([]);
  }, []);

  return list.length ? (
    <>
      <Button onClick={hidden}>收起</Button>
      <List
        style={{ marginTop: '16px' }}
        dataSource={list}
        renderItem={(item) => item.render}
      />
      <Button onClick={hidden}>收起</Button>
    </>
  ) : (
    <Button onClick={show}>显示高级样式</Button>
  );
};
