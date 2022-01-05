import { FunctionComponent, CSSProperties } from 'react';

interface ContainerProps {
  style?: CSSProperties;
}

const Container: FunctionComponent<ContainerProps> = ({ style = {}, ...props }) => (
  <section
    style={{ display: 'flex', flexFlow: 'column nowrap', width: '100vw', height: '100vh', ...style }}
    {...props}
  ></section>
);

export default Container;
