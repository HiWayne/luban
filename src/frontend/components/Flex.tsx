/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSSProperties, FC, MouseEventHandler } from 'react';
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
  onClick?: MouseEventHandler;
}

export const Flex = styled<FC<FlexProps>>(
  ({ className, children, style, onClick }) => (
    <div className={className} style={style} onClick={onClick}>
      {children}
    </div>
  ),
)`
  display: ${(props) => (props.layout === 'inline' ? 'inline-flex' : 'flex')};
  flex-direction: ${(props) => props.direction || 'row'};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'no-wrap')};
  ${(props) =>
    props.justifyContent ? `justify-content: ${props.justifyContent};` : ''}
  ${(props) => (props.alignItems ? `align-items: ${props.alignItems};` : '')}
`;
