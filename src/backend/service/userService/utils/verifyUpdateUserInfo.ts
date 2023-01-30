import xss from 'xss';
import { UserRegisterDTO } from '../types';

export const verifyUpdateUserInfo = async (
  user: Partial<UserRegisterDTO> & { id: number },
) => {
  user = { ...user };
  try {
    if (user?.name && !/^[\u4e00-\u9fa5a-zA-Z0-9~!_-]{1,7}$/.test(user?.name)) {
      throw new Error(
        '用户名1~7位字符，只能包含中文、大小写字母、数字、特殊符号: ~!-_',
      );
    }
    if (user?.desc && user.desc.length > 200) {
      throw new Error('用户简介最多200字符');
    }
    if (user?.avatar && user.avatar.length > 100) {
      throw new Error('用户头像url过长');
    }
    if (user?.avatar && !/^https?:\/\/[^.]+\.[^.]+/.test(user.avatar)) {
      throw new Error('用户头像url必须是合法的http网址');
    }
    if (user?.sex && user?.sex !== 'male' && user?.sex !== 'female') {
      throw new Error('用户性别不合法');
    }
    if (user.desc) {
      user.desc = xss(user.desc);
    }
    return user;
  } catch (e) {
    return Promise.reject(e);
  }
};
