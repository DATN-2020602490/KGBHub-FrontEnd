import http from '@/lib/http'
import { Course } from '@/models'

export type RatingBodyType = {
  courseId: string
  star: number
  content: string
}

export type BuyCourseBodyType = {
  courseId: string
  tipPercent?: number
  successUrl?: string
  code?: string
}

export const courseManagerApiRequests: any = {
  create: () => http.post('/courses', undefined),

  get: (id: string) =>
    http.get<Course>(`/courses/${id}`, {
      cache: 'no-store',
    }),

  getList: (params?: string) =>
    http.get(`/courses?${params}`, {
      cache: 'no-store',
    }),

  update: (courseId: string, body: any) =>
    http.patch(`/courses/${courseId}`, body),

  delete: (courseId: number) => http.delete(`/courses/${courseId}`),

  createPart: (courseId: number, body: any) =>
    http.post(`/courses/${courseId}/parts`, body),
  getListParts: (courseId: number) => http.get(`/courses/${courseId}/parts`),

  getPart: (courseId: number, partId: number) =>
    http.get(`/courses/${courseId}/${partId}`),

  updatePart: (courseId: number, partId: number, body: any) =>
    http.patch(`/courses/${courseId}/parts/${partId}`, body),

  deletePart: (courseId: number, partId: number) =>
    http.delete(`/courses/${courseId}/${partId}`),

  approve: (courseId: number) =>
    http.patch(`/courses/${courseId}/actions/approve`, undefined),
}

export const coursePublicApiRequests = {
  getList: (params: string = '') =>
    http.get<{ courses: Course[] }>(`-public/courses` + params, {
      cache: 'no-store',
    }),

  get: (courseId: string) =>
    http.get<Course>(`-public/courses/${courseId}`, { cache: 'no-store' }),

  buy: (body: BuyCourseBodyType) => http.post('/stripe/buy-course', body),

  toogleHeart: (courseId: string) =>
    http.post('-public/courses/actions/heart', { courseId }),

  rating: (body: RatingBodyType) =>
    http.post('-public/courses/actions/rate', body),

  comment: (body: any) => http.post('-public/courses/actions/comment', body),

  editComment: (id: string, body: any) =>
    http.patch(`-public/courses/actions/comment/${id}`, body),

  deleteComment: (id: string) =>
    http.delete(`-public/courses/actions/comment/${id}`),

  reactAction: (body: any) => http.post('-public/courses/actions/emoji', body),
}
