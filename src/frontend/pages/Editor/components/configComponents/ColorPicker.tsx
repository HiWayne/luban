import {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import styled from 'styled-components';
import { Button } from 'antd';
import { DtIcon } from '@duitang/dt-react-mobile';
import arrowBottom from '../../assets/arrowBottom.svg';

interface ColorFCProps {
  className?: string;
  color: string;
  [key: string]: any;
}

const ColorShow = styled<FC<ColorFCProps>>(({ className }) => (
  <div className={className}>
    <DtIcon width="12px" height="12px" src={arrowBottom} />
  </div>
))`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  ${(props) => `background-color: ${props.color};`}
`;

const ColorButton = styled<FC<ColorFCProps>>(
  ({ className, color, onClick }) => (
    <div className={className} onClick={onClick}>
      <ColorShow color={color} />
    </div>
  ),
)`
  padding: 5px;
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
`;

interface ColorPickerProps {
  defaultColor?: string;
  onChange: (color: string) => void;
}

const createRgba = (rgba: {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
}) => {
  const { r, g, b, a } = rgba;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const ColorPicker: FC<ColorPickerProps> = ({
  defaultColor,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const [prevColor, setPrevColor] = useState(
    defaultColor || 'rgba(0, 0, 0, 1)',
  );
  const [color, setColor] = useState(defaultColor || 'rgba(0, 0, 0, 1)');
  const [popInLeft, setPopInLeft] = useState(true);
  const [popInBottom, setPopInBottom] = useState(true);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    if (wrapperRef.current) {
      const top = wrapperRef.current.getBoundingClientRect().top;
      const right =
        window.innerWidth - wrapperRef.current.getBoundingClientRect().right;
      if (top < 337) {
        setPopInBottom(true);
      } else if (top >= 337) {
        setPopInBottom(false);
      }
      if (right < 200) {
        setPopInLeft(true);
      } else if (right >= 200) {
        setPopInLeft(false);
      }
    }
    setShow(true);
  }, []);

  const close = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    window.addEventListener('click', close);
    return () => {
      window.removeEventListener('click', close);
    };
  }, []);

  const positionCss = useMemo(() => {
    const cssObject: CSSProperties = {};
    if (popInLeft) {
      cssObject.left = '-220px';
    } else {
      cssObject.right = '-220px';
    }
    if (popInBottom) {
      cssObject.bottom = '-337px';
    } else {
      cssObject.top = '-337px';
    }
    return cssObject;
  }, [popInLeft, popInBottom]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onClick={(e) => e.stopPropagation()}>
      <ColorButton
        color={prevColor}
        onClick={() => {
          if (!show) {
            open();
          } else {
            close();
          }
        }}
      />
      {show ? (
        <div
          style={{
            position: 'absolute',
            ...positionCss,
            zIndex: 9,
          }}>
          <SketchPicker
            color={color}
            onChange={(colorResult: ColorResult) => {
              setColor(createRgba(colorResult.rgb));
            }}
          />
          <div
            style={{
              backgroundColor: 'white',
              textAlign: 'right',
              padding: '2px 4px',
              borderRadius: '4px',
              boxShadow:
                'rgb(0 0 0 / 15%) 0px 0px 0px 1px, rgb(0 0 0 / 15%) 0px 8px 16px',
            }}>
            <Button
              style={{ marginRight: '8px' }}
              onClick={() => {
                setColor(prevColor);
                close();
              }}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (typeof onChange === 'function') {
                  onChange(color);
                }
                setPrevColor(color);
                close();
              }}>
              确定
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
