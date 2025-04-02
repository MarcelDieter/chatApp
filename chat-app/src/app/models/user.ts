export interface UserDTO {
  userId: number;
  username: string;
  profilePicUrl: string;
  active: boolean;
}

export interface RegisterUser {
  username: string;
  password: string;
  profilePic: File;
}

export interface LoginUser {
  username: string;
  password: string;
  wsId: string;
}
