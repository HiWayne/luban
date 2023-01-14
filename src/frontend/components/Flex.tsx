/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSSProperties, FC } from 'react';
import styled from 'styled-components';

interface FlexProps {
  layout?: 'block' | 'inline';
  direction?: 'row' | 'column';
  wrap?: boolean;
  justifyContent?: string;
  alignItems?: string;
  className?: string;
  children?: JSX.Element | string | null | (JSX.Element | string | null)[];
  style?: CSSProperties;
}

export const Flex = styled<FC<FlexProps>>(
  ({
    className,
    children,
    layout = 'block',
    wrap = false,
    direction = 'row',
    style,
  }) => (
    <div className={className} style={style}>
      {children}
    </div>
  ),
)`
  display: ${(props) => (props.layout === 'block' ? 'flex' : 'inline-flex')};
  flex-direction: ${(props) => props.direction};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'no-wrap')};
  ${(props) =>
    props.justifyContent ? `justify-content: ${props.justifyContent};` : ''}
  ${(props) =>
    props.alignItems ? `justify-content: ${props.alignItems};` : ''}
`;
