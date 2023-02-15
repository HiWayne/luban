import styled from 'styled-components';
import { Avatar } from 'antd';
import { Flex } from '@/frontend/components';

export const UserInfo = styled(
  ({
    className,
    data,
  }: {
    className?: string;
    data: { id: number; name: string; avatar: string };
  }) =>
    data ? (
      <Flex
        className={className}
        justifyContent="flex-start"
        alignItems="center"
        onClick={() => {
          window.open(`/profile?id=${data.id}`);
        }}>
        <Avatar src={data.avatar} />
        <span className="username">{data.name}</span>
      </Flex>
    ) : null,
)`
  cursor: pointer;
  & > .username {
    margin-left: 4px;
    font-size: 12px;
  }
`;
