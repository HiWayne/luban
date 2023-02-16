import { UserEntity } from '../types';

export const formatUserResponse = (user: UserEntity) => {
  if (user) {
    return {
      id: user.id,
      name: user.name,
      desc: user.desc,
      sex: user.sex,
      avatar: user.avatar,
      roles: user.roles,
      create_time: user.create_time,
      last_login_data: user.last_login_data,
    };
  } else {
    return user;
  }
};
