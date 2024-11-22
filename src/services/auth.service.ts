import http from '@/lib/http'
import { LoginResponseType, TokensType } from '@/schemaValidations/auth.schema'

type RefreshTokenResType = {
  accessToken: string
  newRefreshToken: string
}

export const authApiRequest = {
  auth: (tokens: TokensType) =>
    http.post('/api/auth', tokens, {
      baseUrl: '',
    }),

  loginByNextServer: (body: Omit<TokensType, 'refeshToken'>) =>
    http.post<LoginResponseType>('/api/auth/login', body, {
      baseUrl: '',
    }),

  loginByGoogle: (body: Omit<TokensType, 'refreshToken'>) =>
    http.post<LoginResponseType>('/auth/login', body),

  refreshToken: (body: Omit<TokensType, 'accessToken'>) =>
    http.post<RefreshTokenResType>('/auth/refresh', body),

  logout: (accessToken: string) =>
    http.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  logoutByNextServer: () =>
    http.post('/api/auth/logout', undefined, {
      baseUrl: '',
    }),
}
