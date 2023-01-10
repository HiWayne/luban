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
  leftValue?: number;
  leftUnit?: LengthUnit;
  rightValue?: number;
  rightUnit?: LengthUnit;
  topValue?: number;
  topUnit?: LengthUnit;
  bottomValue?: number;
  bottomUnit?: LengthUnit;
}

export interface BorderStyleConfig {
  borderWidthValue: number;
  borderWidthUnit: LengthUnit;
  borderStyle: BorderStyle;
  borderColor: string;
}

export interface CustomStyleConfigData {
  positionStyleConfig?: PositionStyleConfig;
  borderStyleConfig?: BorderStyleConfig;
}

interface CustomStyleConfigProps {
  defaultStyleConfig?: CustomStyleConfigData;
  onChange: (data: {
    style: CSSProperties;
    styleConfig: CustomStyleConfigData;
  }) => void;
}

export const CustomStyleConfig: FC<CustomStyleConfigProps> = ({
  defaultStyleConfig,
  onChange,
}) => {
  const [styleConfig, setStyleConfig] = useState<CustomStyleConfigData>(
    defaultStyleConfig || {},
  );
  const [style, setStyle] = useState<CSSProperties>({});
  const [list, setList] = useState<{ type: string; render: JSX.Element }[]>([]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange({ style, styleConfig });
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
            if (!Array.isArray(data)) {
              const { styleConfig: borderStyleConfig, style: borderStyle } =
                data;
              setStyleConfig((oldStyleConfig) => ({
                ...oldStyleConfig,
                border: borderStyleConfig,
              }));
              setStyle((oldStyle) => ({ ...oldStyle, ...borderStyle }));
            } else {
              setStyleConfig((oldStyleConfig) => {
                const newStyleConfig = { ...oldStyleConfig };
                if (newStyleConfig.borderStyleConfig) {
                  delete newStyleConfig.borderStyleConfig;
                }
                return newStyleConfig;
              });
              setStyle((oldStyle) => {
                const newStyleObj = { ...oldStyle };
                if (newStyleObj.border) {
                  delete newStyleObj.border;
                }
                return newStyleObj;
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
          onChange={(data) => {
            if (!Array.isArray(data)) {
              const { style: positionStyle, styleConfig: positionStyleConfig } =
                data;
              setStyleConfig((oldStyleConfig) => ({
                ...oldStyleConfig,
                ...positionStyleConfig,
              }));
              setStyle((oldStyleObj) => ({
                ...oldStyleObj,
                ...positionStyle,
              }));
            } else {
              setStyleConfig((oldStyleConfig) => {
                const newStyleCOnfig = { ...oldStyleConfig };
                if (newStyleCOnfig.positionStyleConfig) {
                  delete newStyleCOnfig.positionStyleConfig;
                }
                return newStyleCOnfig;
              });
              setStyle((oldStyleObj) => {
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
