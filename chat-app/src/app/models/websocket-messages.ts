import { Message } from './message'
import { UserData } from './user'

export interface ActiveUserMessage {
  type: string,
  userId: number,
  active: boolean
}
export interface NewUserMesaage {
  type: string,
  userData: UserData
}

export interface WebsocketChatMessage {
  type: string,
  message: Message
}