import http from '@/lib/http'
import { User } from '@/models'

export const userApiRequest = {
  getList: (params: string, access_token: string) =>
    http.get<any>(`/users?${params}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }),

  get: (userId: string, access_token?: string) =>
    http.get<User>(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

  verifyUser: (verifyCode: string) =>
    http.post<User>('/users/verify', { verifyCode }),

  verifyInstructor: (body: any) => http.post('/users/author/verify', body),

  create: (body: any) => http.post('/users', body),

  edit: (userId: string, body: any) =>
    http.patch<any>(`/users/${userId}`, body),

  delete: (userId: string) => http.delete(`/users/${userId}`),

  getCourseProgress: () => http.get('/users/actions/progress'),

  getCourseBought: () => http.get('/users/actions/bought'),

  getWishList: () => http.get('/users/actions/hearted', { cache: 'no-store' }),

  getForm: (access_token: string) =>
    http.get('/users/actions/forms', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }),

  editForm: (body: any) => http.patch('/users/actions/forms', body),
}
