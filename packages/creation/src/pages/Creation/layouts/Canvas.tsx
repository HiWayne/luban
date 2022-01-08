import { FunctionComponent, useMemo } from 'react';
import styled from '@emotion/styled';
import Page from 'core/src/render/index';

const Border = styled.div`
  width: 750px;
  height: calc(100vh - 80px);
  border: 1px solid #bbb;
  overflow: hidden;
`;

interface CanvasProps {
  data: object;
}

const Canvas: FunctionComponent<CanvasProps> = ({ data }) => {
  const json = useMemo(() => (data ? JSON.stringify(data) : ''), [data]);

  return (
    <Border>
      <Page data={json} />
    </Border>
  );
};

export default Canvas;
