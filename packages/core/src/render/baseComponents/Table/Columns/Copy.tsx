import { FunctionComponent, useCallback } from 'react';
import { notification } from 'antd';
import styled from '@emotion/styled';
import { ColumnNames } from 'types/types';
import { definePropertyOfName } from 'utils/index';
import copyIcon from 'images/icon-copy.png';

interface CopyProps {
  data: string;
}

const openNotification = () => {
  notification['success']({
    message: '复制成功',
    duration: 2,
  });
};

const CopyWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  &:hover > span {
    background-color: rgba(0, 0, 0, 0.1);
  }
  & > p {
    margin-bottom: 0;
  }
`;

const CopyButton = styled.span`
  margin-left: 5px;
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url(${copyIcon}) center / 20px no-repeat;
  transition: all 0.2s ease-in;
`;

const Copy: FunctionComponent<CopyProps> = ({ data }) => {
  const handleClick = useCallback(() => {
    if (document.execCommand('copy')) {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.setAttribute('value', data);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      openNotification();
    }
  }, [data]);

  if (typeof data === 'string') {
    return (
      <CopyWrapper>
        <p onClick={handleClick}>{data}</p>
        <CopyButton onClick={handleClick} />
      </CopyWrapper>
    );
  } else {
    console.error(`data of props should be string, but got "${typeof data}" in column copy`);
    return null;
  }
};

definePropertyOfName(Copy, ColumnNames.COPY);

export default Copy;
