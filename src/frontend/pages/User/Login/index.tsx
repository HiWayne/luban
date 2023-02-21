import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Checkbox, Input } from 'antd';
import { getParams } from '@duitang/dt-base';
import { Flex } from '@/frontend/components';
import { useLogin } from '../hooks';

const OuterWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(https://c-ssl.dtstatic.com/uploads/ops/202302/08/20230208142149_89116.png);
  background-color: #97befc;
  background-size: contain;
  background-position: bottom;
  background-repeat: repeat no-repeat;
`;

const FlexWrapper = styled(Flex)`
  width: 500px;
  padding: 20px 50px;
  background-color: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 4px 8px -4px rgb(0 0 0 / 13%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 12px 24px 16px rgb(0 0 0 / 4%);
`;

const Title = styled.div`
  color: #545454;
  font-size: 24px;
  padding: 10px 0 40px;
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
    <OuterWrapper>
      <FlexWrapper
        direction="column"
        justifyContent="center"
        alignItems="center">
        <Title>欢迎回来</Title>
        <LoginWrapper direction="column">
          <Input
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="账号"
          />
          <Input.Password
            value={password}
            onChange={(event) => setPassWord(event.target.value)}
            placeholder="密码"
          />
          <Checkbox
            checked={remember}
            onChange={(event) => {
              setRemember(event.target.checked);
            }}>
            是否保持登录
          </Checkbox>
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ marginTop: '20px' }}>
            <Button size="middle" type="primary" onClick={loginThenNavigate}>
              登录
            </Button>
            <Tip onClick={toRegisterPage}>没有账号？立即注册</Tip>
          </Flex>
        </LoginWrapper>
      </FlexWrapper>
    </OuterWrapper>
  );
};

export default Login;
