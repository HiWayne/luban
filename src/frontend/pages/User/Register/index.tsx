import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Alert, Button, Form, Input, Radio } from 'antd';
import { dtThumb, getParams } from '@duitang/dt-base';
import { ReactComponent as MaleSVG } from 'assets/male.svg';
import { ReactComponent as FemaleSVG } from 'assets/female.svg';
import { Flex } from '@/frontend/components';
import { UploadImageConfig } from '../../Editor/components/configComponents/UploadImageConfig';
import { useRegister } from '../hooks';

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

const Register = () => {
  const {
    name,
    setName,
    nameError,
    password,
    setPassWord,
    passwordError,
    confirmPassword,
    setConfirmPassword,
    sex,
    setSex,
    sexError,
    desc,
    setDesc,
    descError,
    avatar,
    setAvatar,
    verify,
    register,
  } = useRegister();

  const toUrl = useMemo(() => {
    const { url = '/' } = getParams();
    return decodeURIComponent(url);
  }, []);

  const navigate = useNavigate();

  const sexOptions = useMemo(
    () => [
      {
        label: (
          <Flex>
            <span>男</span>
            <MaleSVG />
          </Flex>
        ),
        value: 'male',
      },
      {
        label: (
          <Flex>
            <span>女</span>
            <FemaleSVG />
          </Flex>
        ),
        value: 'female',
      },
    ],
    [],
  );

  const registerThenNavigate = useCallback(async () => {
    await register();
    navigate(toUrl, { replace: true });
  }, [register, toUrl]);

  return (
    <OuterWrapper>
      <FlexWrapper direction="column" alignItems="center">
        <Title>初次见面</Title>
        <Form
          labelCol={{ span: 5 }}
          labelAlign="left"
          style={{ width: '100%' }}>
          <Form.Item label="头像">
            <UploadImageConfig
              defaultUrl={dtThumb(avatar, 100, false, true)}
              onChange={(url) => setAvatar(dtThumb(url, 100, false, true))}
            />
          </Form.Item>
          <Form.Item
            required
            label="昵称"
            extra={
              nameError ? <Alert type="error" message={nameError} /> : null
            }>
            <Input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              onBlur={verify}
            />
          </Form.Item>
          <Form.Item
            required
            label="性别"
            extra={sexError ? <Alert type="error" message={sexError} /> : null}>
            <Radio.Group
              defaultValue={sex}
              options={sexOptions}
              onChange={(event) => setSex(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="用户简介"
            extra={
              descError ? <Alert type="error" message={descError} /> : null
            }>
            <Input.TextArea
              value={desc}
              onChange={(event) => {
                setDesc(event.target.value);
              }}
              onBlur={verify}
              maxLength={200}
              showCount
              autoSize
              placeholder="这个用户真能吃，什么也没留下"
            />
          </Form.Item>
          <Form.Item
            required
            label="密码"
            extra={
              passwordError ? (
                <Alert type="error" message={passwordError} />
              ) : null
            }>
            <Input.Password
              value={password}
              onChange={(event) => {
                setPassWord(event.target.value);
              }}
              onBlur={verify}
            />
          </Form.Item>
          <Form.Item label="确认密码" required>
            <Input.Password
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              onBlur={verify}
            />
          </Form.Item>
        </Form>
        <div>
          <Button type="primary" onClick={registerThenNavigate}>
            注册
          </Button>
        </div>
      </FlexWrapper>
    </OuterWrapper>
  );
};

export default Register;
