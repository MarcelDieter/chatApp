import { TokenResponse } from './token-response';
import { UserDTO } from './user';

export interface LoginResponse {
  userDTO: UserDTO,
  settings: { notificationsOn: boolean},
  tokens: TokenResponse;
}