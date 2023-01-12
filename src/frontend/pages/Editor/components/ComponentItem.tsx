import { FC } from 'react';
import styled from 'styled-components';
import { ToCComponent } from '../config';
import { useUpdateNodeAST } from '../hooks/useUpdateNodeAST';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  border: 1px solid #e3e6eb;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 0 8px;
`;

const Name = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #13161b;
  cursor: grab;
`;

// const Image = styled.img`
//     width: 16px;
//     height: 16px;
//     margin-right: 8px;
// `

interface ComponentItemProp {
  data: ToCComponent;
}

export const ComponentItem: FC<ComponentItemProp> = ({ data }) => {
  const { name } = data;

  const { addNodeAST } = useUpdateNodeAST(data);

  return (
    <Wrapper draggable onClick={addNodeAST}>
      {/* <Image src={icon} alt="小图标" /> */}
      <Name>{name}</Name>
    </Wrapper>
  );
};
