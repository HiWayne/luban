export interface UserRegisterDTO {
  name: string;
  desc: string;
  sex: 'male' | 'female';
  avatar: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  desc: string;
  sex: 'male' | 'female';
  avatar: string;
  create_time: number;
  roles: string[];
}

export interface LoginInDTO {
  userName: string;
  password: string;
}

export interface SearchUsersRequestDTO {
  ids?: string;
  name?: string;
  create_time_start?: string;
  create_time_end?: string;
  start?: string;
  limit?: string;
}

export interface FormatSearchUsersRequestDTO {
  ids?: number[];
  name?: string;
  create_time_start?: number;
  create_time_end?: number;
  start: number;
  limit: number;
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
  last_login_times: number[];
  roles: string[];
}
