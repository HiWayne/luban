import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Button = styled(({ className, style }) => (
  <div className={className} style={style}>
    <div className="left" />
    <div className="right" />
  </div>
))`
  position: absolute;
  width: 8px;
  border-radius: 4px;
  background: linear-gradient(
    rgb(23, 23, 23) 0%,
    rgb(229, 229, 227) 10%,
    rgb(229, 229, 227) 90%,
    rgb(23, 23, 23) 100%
  );
  z-index: 0;
  & > .left {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 1px;
    height: calc(100% - 8px);
    background: rgb(172, 172, 172);
  }
  & > .right {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 1px;
    height: calc(100% - 8px);
    background: rgb(172, 172, 172);
  }
`;

export const OutputPageArea = styled(
  ({
    mode,
    className,
  }: {
    mode: 'development' | 'production';
    className?: string;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        const height = getComputedStyle(containerRef.current).height;
        const width = `${(parseFloat(height) * 0.461538462).toFixed(1)}px`;
        containerRef.current.style.width = width;
        const html = document.querySelector('html');
        if (html && !html.style.fontSize) {
          html.style.fontSize = `${(1 / 375) * parseFloat(width)}px`;
        }
      }
    });

    return (
      <div className={className}>
        <div className="border1" />
        <div className="border2" />
        <div className="border3" />
        <Button style={{ height: '30px', left: '-6px', top: '60px' }} />
        <Button style={{ height: '70px', left: '-6px', top: '120px' }} />
        <Button style={{ height: '70px', left: '-6px', top: '200px' }} />
        <Button style={{ height: '100px', right: '-6px', top: '140px' }} />
        <div
          ref={containerRef}
          id={`lubanAppContainer-${mode}`}
          key="container"
        />
      </div>
    );
  },
)`
  display: inline-block;
  position: relative;
  padding: 4px;
  border: 1px solid rgb(1, 1, 1);
  border-radius: 38px;
  background: rgb(245, 245, 249);

  & > .border1 {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    border: 1px solid rgb(133, 133, 130);
    border-radius: 38px;
    box-sizing: border-box;
    z-index: 1;
  }

  & > .border2 {
    position: absolute;
    left: 1px;
    top: 1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    border: 2px solid rgb(227, 228, 225);
    border-radius: 38px;
    box-sizing: border-box;
    z-index: 1;
  }

  & > .border3 {
    position: absolute;
    left: 3px;
    top: 3px;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    border: 1px solid rgb(133, 133, 130);
    border-radius: 38px;
    box-sizing: border-box;
    z-index: 1;
  }

  #lubanAppContainer-${(props) => props.mode} {
    position: relative;
    height: calc(90vh + 2px);
    border: 12px solid rgb(0, 0, 4);
    border-radius: 36px;
    box-sizing: border-box;
    overflow: auto;
    z-index: 2;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      color: transparent;
    }
  }
`;
