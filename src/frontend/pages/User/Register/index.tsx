import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Alert, Button, Form, Input, Radio } from 'antd';
import { dtThumb, getParams } from '@duitang/dt-base';
import { Flex } from '@/frontend/components';
import { UploadImageConfig } from '../../Editor/components/configComponents/UploadImageConfig';
import { useRegister } from '../hooks';

const FlexWrapper = styled(Flex)`
  margin-top: 50px;
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
          <div>
            <span>男</span>
            <span style={{ color: '#58a4eb', fontWeight: 'bolder' }}>♂</span>
          </div>
        ),
        value: 'male',
      },
      {
        label: (
          <div>
            <span>女</span>
            <span style={{ color: '#e071ad', fontWeight: 'bolder' }}>♀</span>
          </div>
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
    <FlexWrapper direction="column" alignItems="center">
      <Form labelCol={{ span: 5 }} labelAlign="left">
        <Form.Item label="头像">
          <UploadImageConfig
            defaultUrl={dtThumb(avatar, 100, false, true)}
            onChange={(url) => setAvatar(dtThumb(url, 100, false, true))}
          />
        </Form.Item>
        <Form.Item
          required
          label="昵称"
          extra={nameError ? <Alert type="error" message={nameError} /> : null}>
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
          extra={descError ? <Alert type="error" message={descError} /> : null}>
          <Input.TextArea
            value={desc}
            onChange={(event) => {
              setDesc(event.target.value);
            }}
            onBlur={verify}
            maxLength={200}
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
  );
};

export default Register;
