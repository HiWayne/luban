import styled from '@emotion/styled';
import { CSSProperties, FunctionComponent, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import left_arrow from '@creation/images/left_arrow.png';
import right_arrow from '@creation/images/right_arrow.png';

export const ShadowPanel = styled.section`
  position: relative;
  padding: 20px;
  background-color: #fff;
  background-clip: padding-box;
  border: 0;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
  pointer-events: auto;
  box-sizing: border-box;
`;

const ArrowButton = styled(({ direction, open, ...props }) => <i {...props}></i>)`
  position: absolute;
  top: 50%;
  ${(props) => (props.direction === 'left' ? 'right: 0;' : 'left: 0;')}
  transform: translate(${(props) => (props.direction === 'left' ? '100%' : '-100%')}, -50%);
  width: 50px;
  height: 50px;
  background: url(${(props) =>
      props.direction === 'left' ? (props.open ? left_arrow : right_arrow) : props.open ? right_arrow : left_arrow})
    center / cover no-repeat;
  cursor: pointer;
  z-index: 999;
`;

interface AnimateProps {
  direction?: 'left' | 'right';
  width?: number;
  style?: CSSProperties;
  children?: JSX.Element;
  className?: string;
}

const Animate: FunctionComponent<AnimateProps> = ({
  direction = 'left',
  width = 200,
  children,
  style,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(true);
  const { x } = useSpring({
    reverse: !open,
    from: { x: direction === 'left' ? -1 : 1 },
    x: 0,
  });

  return (
    <animated.section style={{ transform: x.to((x) => `translate3d(${x * width - 20}px, 0, 0)`) }} {...props}>
      <ShadowPanel style={style} className={className}>
        <ArrowButton
          direction={direction}
          open={open}
          onClick={() => {
            setOpen(!open);
          }}
        />
        {children}
      </ShadowPanel>
    </animated.section>
  );
};

export default Animate;
