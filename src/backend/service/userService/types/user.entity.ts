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
  last_login_times: number[];
  roles: string[];
}
