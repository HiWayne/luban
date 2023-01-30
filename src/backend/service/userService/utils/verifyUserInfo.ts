import xss from 'xss';
import { UserRegisterDTO } from '../types';
import { decode } from './decode';

export const verifyUserInfo = async (user: UserRegisterDTO) => {
  try {
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9~!_-]{1,7}$/.test(user?.name)) {
      throw new Error(
        '用户名1~7位字符，只能包含中文、大小写字母、数字、特殊符号: ~!-_',
      );
    }
    const decodedPassword = await decode(user?.password);
    if (!/^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(decodedPassword)) {
      throw new Error('密码必须包含数字和字母，8~16位，不能有特殊字符');
    }
    if ((user?.desc || '').length > 200) {
      throw new Error('用户简介最多200字符');
    }
    if (user?.avatar && user.avatar.length > 100) {
      throw new Error('用户头像url过长');
    }
    if (user?.avatar && !/^https?:\/\/[^.]+\.[^.]+/.test(user.avatar)) {
      throw new Error('用户头像url必须是合法的http网址');
    }
    if (user?.sex !== 'male' && user?.sex !== 'female') {
      throw new Error('用户性别不合法');
    }
    return { ...user, desc: xss(user?.desc || '') };
  } catch (e) {
    return Promise.reject(e);
  }
};
