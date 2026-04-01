import type { IUser } from './base'

export interface ILoginPayload {
  username: string
  password: string
}

export interface ILoginResponse {
  token: string
  user: IUser
}

export type AuthUser = IUser | null
