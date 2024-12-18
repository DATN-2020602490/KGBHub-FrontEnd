import http from '@/lib/http'
import { Order, User } from '@/models'

export const userApiRequest = {
  getList: (params: string, access_token: string) =>
    http.get<any>(`/users?${params}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }),

  get: (userId: string) => http.get<User>(`/users/${userId}`),

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

  search: (keyword: string) =>
    http.get<User[]>(`/users/actions/user-search/${keyword}`),


  getOrderDetail: ({
    id
  }: {
    id: string
  }) => {
    return http.get<Order>(`/stripe/orders/${id}`)
  },

  getOrders: ({
    limit,
    offset,
  }: {
    limit?: number
    offset?: number
  }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const queryParams = new URLSearchParams({
      userId: user.id,
      ...(limit !== undefined && { limit: limit.toString() }),
      ...(offset !== undefined && { offset: offset.toString() }),
    }).toString()
    return http.get<Order[]>(`/stripe/orders?${queryParams}`)
  },
}
