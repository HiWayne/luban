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

export interface UserEntity {
  id: number;
  _password: string;
  _salt: string;
  name: string;
  desc: string;
  sex: 'male' | 'female';
  avatar: string;
  create_time: number;
  roles: string[];
}
