import { Conversation } from './conversation'
import { Message } from './message'
import { UserDTO } from './user'

export interface InformationMessage {
  type: string,
  data: {userId: number, active: boolean} | UserDTO | Message | Conversation
}