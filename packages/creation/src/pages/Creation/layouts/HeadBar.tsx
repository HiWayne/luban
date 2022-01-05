import { CSSProperties, FunctionComponent, useState } from 'react';
import styled from '@emotion/styled/macro';
import { ShadowPanel } from '@creation/components/Panel';

const Wrapper = styled(({ ...props }) => <ShadowPanel {...props}></ShadowPanel>)`
  padding: 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

enum CaseType {
  base = 'base',
  hover = 'hover',
}

enum ButtonType {
  complete = 'complete',
  clear = 'clear',
  return = 'return',
  save = 'save',
}

type TypeColorMap = {
  [key in CaseType]: { [key in ButtonType]: string };
};

const typeColorMap: TypeColorMap = {
  base: {
    [ButtonType.complete]: '#409EFF',
    [ButtonType.clear]: '#f4f4f5',
    [ButtonType.return]: '#F56C6C',
    [ButtonType.save]: '#67c23a',
  },
  hover: {
    [ButtonType.complete]: '#66b1ff',
    [ButtonType.clear]: '#909399',
    [ButtonType.return]: '#f78989',
    [ButtonType.save]: '#85ce61',
  },
};

interface ButtonProps {
  type: ButtonType;
  style?: CSSProperties;
}

const Button = styled<FunctionComponent<ButtonProps>>(({ type, ...props }) => <button {...props}></button>)`
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid
    ${(props: ButtonProps) =>
      typeColorMap[CaseType.base][props.type] || typeColorMap[CaseType.base][ButtonType.complete]};
  background-color: ${(props: ButtonProps) =>
    typeColorMap[CaseType.base][props.type] || typeColorMap[CaseType.base][ButtonType.complete]};
  color: ${(props) => (props.type === ButtonType.clear ? '#909399' : '#ffffff')};
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;

  &:hover {
    color: #ffffff;
    border-color: ${(props: ButtonProps) =>
      typeColorMap[CaseType.hover][props.type] || typeColorMap[CaseType.hover][ButtonType.complete]};
    background-color: ${(props: ButtonProps) =>
      typeColorMap[CaseType.hover][props.type] || typeColorMap[CaseType.hover][ButtonType.complete]};
  }
`;

const Title = styled.input`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #f60;
  border: none;
  text-align: center;
  &:focus {
    outline: none;
    border: 1px solid #f60;
  }
  &::placeholder {
    color: rgba(255, 102, 0, 0.5);
    font-size: 16px;
  }
`;

interface HeadBarProps {
  title: string;
  data: object;
}

const HeadBar: FunctionComponent<HeadBarProps> = ({ title, data }) => {
  const [_title, setTitle] = useState(title || '默认标题');
  return (
    <Wrapper>
      <Button type={ButtonType.return}>返回上一级</Button>
      <Title
        value={_title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        maxLength={20}
        placeholder="请填写网页标题，最多20字"
      ></Title>
      <div>
        <Button type={ButtonType.save}>保存</Button>
        <Button type={ButtonType.clear} style={{ margin: '0 15px' }}>
          清空
        </Button>
        <Button type={ButtonType.complete}>完成</Button>
      </div>
    </Wrapper>
  );
};

export default HeadBar;
