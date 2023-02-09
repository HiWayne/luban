import { forwardRef } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const globalStyle = `
position: fixed;
left: 0;
top: 0;
right: 0;
bottom: 0;
margin: auto;
display: flex;
justify-content: center;
align-items: center;
width: 200px;
height: 200px;
`;

const inlineStyle = `
  display: inline-block;
`;

const blockStyle = `
  display: block;
  margin: 0 auto;
  text-align: center;
`;

type LoadingPropsType = 'global' | 'inline' | 'block';

interface LoadingProps {
  // eslint-disable-next-line react/no-unused-prop-types
  type?: LoadingPropsType;
  // eslint-disable-next-line react/no-unused-prop-types
  size?: 'small' | 'default' | 'large';
  className?: string;
}

const styleMap: Record<LoadingPropsType, string> = {
  global: globalStyle,
  inline: inlineStyle,
  block: blockStyle,
};

export const Loading = styled(
  forwardRef<any, LoadingProps>(({ className, size }, ref) => (
    <div className={className} ref={ref}>
      <Spin size={size} />
    </div>
  )),
)`
  ${(props) => styleMap[props.type || 'global']}
`;
