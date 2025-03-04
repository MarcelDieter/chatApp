import { TokenResponse } from './token-response';
import { UserData } from './userdata';

export interface LoginResponse {
  userData: UserData,
  tokens: TokenResponse;
}