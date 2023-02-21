import { Link, useNavigate } from 'react-router-dom';
import { FC, MouseEventHandler, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { UserResponseDTO } from '@/backend/service/userService/types';
import { Flex } from './Flex';
import { HEADER_BAR_HEIGHT } from '../style';
import { Avatar } from './Avatar';
import { clearTokens } from '../pages/User/utils';
import { useQueryUserApi } from '../pages/User/api';

const BarWrapper = styled(Flex)`
  padding: 0 24px;
  height: ${HEADER_BAR_HEIGHT};
  background: rgba(255, 255, 255, 0.8);
  user-select: none;
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

const UserName = styled.span`
  margin-left: 4px;
  font-size: 14px;
`;

const Menu = styled.li`
  padding: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  background: #fff;
  box-sizing: border-box;
  &:not(:first-child) {
    border-top: 1px solid rgba(100, 100, 100, 0.1);
  }
  &:hover {
    background: #eee;
  }
`;

const Menus = styled(({ className }) => {
  const logout = useCallback(() => {
    clearTokens();
    window.location.reload();
  }, []);

  return (
    <ul className={className}>
      <Link to="/profile">
        <Menu>用户信息</Menu>
      </Link>
      <Link to="/creation">
        <Menu>我的创作</Menu>
      </Link>
      <Menu onClick={logout}>退出登录</Menu>
    </ul>
  );
})`
  padding: 0;
  display: none;
  position: absolute;
  right: -10px;
  top: 50px;
  width: 120px;
  box-sizing: border-box;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(100, 100, 100, 0.1);
`;

interface UserProps {
  className?: string;
  data: UserResponseDTO | null;
}

const User = styled<FC<UserProps>>(({ className, data }) => {
  const navigate = useNavigate();

  const url = useMemo(() => {
    return window.location.pathname === '/'
      ? ''
      : encodeURIComponent(
          window.location.pathname +
            window.location.search +
            window.location.hash,
        );
  }, []);

  const handleClick = useCallback<MouseEventHandler>(
    (event) => {
      event.stopPropagation();
      if (!data) {
        navigate(url ? `/login?url=${url}` : '/login');
      }
    },
    [data],
  );

  return (
    <Flex className={className} alignItems="center" onClick={handleClick}>
      <Avatar size={32} src={data?.avatar} />
      <UserName>{data?.name || '未登录'}</UserName>
      {data ? <Menus className="user-menus" /> : null}
    </Flex>
  );
})`
  position: relative;
  height: 100%;
  cursor: pointer;

  &:hover > .user-menus {
    display: block;
  }
`;

export const HeaderBar = () => {
  const { user, queryOwnUser, ownLoadingRef } = useQueryUserApi({
    errorNotify: false,
  });

  useEffect(() => {
    if (!ownLoadingRef.current) {
      queryOwnUser();
    }
  }, []);

  return (
    <BarWrapper justifyContent="space-between" alignItems="center">
      <div>首页</div>
      <User data={user} />
    </BarWrapper>
  );
};
