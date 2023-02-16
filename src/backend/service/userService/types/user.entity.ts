export interface LoginData {
  login_time: number;
  ip: string;
}

export interface UserEntity {
  _id: string;
  id: number;
  _password: string;
  _salt: string;
  name: string;
  desc: string;
  sex: 'male' | 'female';
  avatar: string;
  create_time: number;
  last_login_data: LoginData[];
  roles: string[];
}
