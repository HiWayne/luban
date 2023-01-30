import { useEffect, useState } from 'react';
import { useLoginApi } from '../api';

const CACHE_OF_REMEMBER = 'CACHE_OF_REMEMBER';

export const useLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [remember, setRemember] = useState(
    !!Number(window.localStorage.getItem(CACHE_OF_REMEMBER)),
  );
  const { user, login } = useLoginApi(userName, password, remember);

  useEffect(() => {
    window.localStorage.setItem(CACHE_OF_REMEMBER, remember ? '1' : '0');
  }, [remember]);

  return {
    user,
    userName,
    setUserName,
    password,
    setPassWord,
    remember,
    setRemember,
    login,
  };
};
