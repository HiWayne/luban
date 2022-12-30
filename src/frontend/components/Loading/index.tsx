import styled from 'styled-components';
import loadingIcon from 'assets/images/loading.svg';
import { forwardRef } from 'react';

const globalStyle = `
position: fixed;
left: 0;
top: 0;
right: 0;
bottom: 0;
margin: auto;
`;

const inlineStyle = `
  display: inline-block;
`;

const blockStyle = `
  display: block;
  margin: 0 auto;
`;

type LoadingPropsType = 'global' | 'inline' | 'block';

interface LoadingProps {
  // eslint-disable-next-line react/no-unused-prop-types
  type?: LoadingPropsType;
  // eslint-disable-next-line react/no-unused-prop-types
  size?: number;
  className?: string;
}

const styleMap: Record<LoadingPropsType, string> = {
  global: globalStyle,
  inline: inlineStyle,
  block: blockStyle,
};

export const Loading = styled(
  forwardRef<any, LoadingProps>(({ className }, ref) => (
    <div ref={ref} className={className} />
  )),
)`
  ${(props) => styleMap[props.type || 'global']}
  width: ${(props) => (props.size ? `${props.size}px` : '48px')};
  height: ${(props) => (props.size ? `${props.size}px` : '48px')};
  background: url('${loadingIcon}') center / cover no-repeat;
  animation: 2s Round linear infinite;

  @keyframes Round {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
