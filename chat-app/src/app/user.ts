export interface RegisterForm {
  username: string;
  password: string;
  profilePic: File;
}

export interface LoginForm {
  username: string; 
  password: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  profilePic: string;
  active: boolean;
}