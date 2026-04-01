import { _get, _post } from './api-service'
import type { ILoginPayload, ILoginResponse } from '@/types/auth'
import type { IUser } from '@/types/base'

export const AuthService = {
  login: (data: ILoginPayload): Promise<ILoginResponse> => _post('/v1/auth/login', data),

  getMe: (): Promise<IUser> => _get('/v1/auth/me'),
}
