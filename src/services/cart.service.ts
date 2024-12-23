import http from '@/lib/http'
import { Cart } from '@/models'

export const cartApiRequest = {
  get: () =>
    http.get<Cart>('-public/carts', {
      cache: 'no-store',
    }),

  add: (courseId: string) =>
    http.post('-public/carts/actions/add', { courseId }),

  remove: (courseIds: string[]) =>
    http.post('-public/carts/actions/remove', { courseIds }),

  clear: () => http.post('-public/carts/actions/clear', {}),

  checkout: (courseIds: string[]) =>
    http.post('/stripe/checkout-from-cart', { courseIds }),
}
