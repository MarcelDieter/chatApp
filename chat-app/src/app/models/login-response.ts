import { TokenResponse } from './token-response';
import { UserData } from './user';

export interface LoginResponse {
  userData: UserData,
  tokens: TokenResponse;
}