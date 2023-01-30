import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Checkbox, Input } from 'antd';
import { getParams } from '@duitang/dt-base';
import { Flex } from '@/frontend/components';
import { useLogin } from '../hooks';
import { HEADER_BAR_HEIGHT } from '@/frontend/style';

const FlexWrapper = styled(Flex)`
  height: calc(100vh - ${HEADER_BAR_HEIGHT});
`;

const LoginWrapper = styled(Flex)`
  width: 300px;
  gap: 8px;
`;

const Tip = styled.div`
  padding: 12px 0;
  font-size: 12px;
  color: #5678a0;
  cursor: pointer;
  &:hover {
    color: #1677ff;
  }
`;

const Login = () => {
  const {
    userName,
    setUserName,
    password,
    setPassWord,
    remember,
    setRemember,
    login,
  } = useLogin();

  const navigate = useNavigate();

  const toUrl = useMemo(() => {
    const { url = '/' } = getParams();
    return url;
  }, []);

  const toRegisterPage = useCallback(() => {
    navigate(`/register?url=${toUrl}`, { replace: true });
  }, [toUrl]);

  const loginThenNavigate = useCallback(async () => {
    await login();
    navigate(decodeURIComponent(toUrl), { replace: true });
  }, [login]);

  return (
    <FlexWrapper justifyContent="center" alignItems="center">
      <LoginWrapper direction="column">
        <Input
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
        />
        <Input.Password
          value={password}
          onChange={(event) => setPassWord(event.target.value)}
        />
        <div>
          <Checkbox
            style={{ marginRight: '4px' }}
            checked={remember}
            onChange={(event) => {
              setRemember(event.target.checked);
            }}
          />
          <span>是否保持登录</span>
        </div>
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Button size="middle" type="primary" onClick={loginThenNavigate}>
            登录
          </Button>
          <Tip onClick={toRegisterPage}>没有账号？立即注册</Tip>
        </Flex>
      </LoginWrapper>
    </FlexWrapper>
  );
};

export default Login;
