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

export const courseManagerApiRequests = {
  create: () => http.post('/courses', undefined),

  get: (id: string) =>
    http.get<Course>(`/courses/${id}`, {
      cache: 'no-store',
    }),

  getList: (params?: string) =>
    http.get<Course[]>(`/courses?${params}`, {
      cache: 'no-store',
    }),

  update: (courseId: string, body: any) =>
    http.patch(`/courses/${courseId}`, body),

  delete: (courseId: string) => http.delete(`/courses/${courseId}`),

  createPart: (courseId: string, body: any) =>
    http.post(`/courses/${courseId}/parts`, body),
  getListParts: (courseId: string) => http.get(`/courses/${courseId}/parts`),

  getPart: (courseId: number, partId: number) =>
    http.get(`/courses/${courseId}/${partId}`),

  updatePart: (courseId: string, partId: number, body: any) =>
    http.patch(`/courses/${courseId}/parts/${partId}`, body),

  deletePart: (courseId: string, partId: number) =>
    http.delete(`/courses/${courseId}/${partId}`),

  approve: (courseId: string) =>
    http.patch(`/courses/${courseId}/actions/approve`, undefined),
}

export const coursePublicApiRequests = {
  getList: (params: string = '') =>
    http.get<Course[]>(`-public/courses` + params, {
      cache: 'no-store',
    }),

  get: (courseId: string, accessToken?: string) =>
    http.get<Course>(`-public/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }),

  buy: (body: BuyCourseBodyType) => http.post('/stripe/buy-course', body),

  toogleHeart: (courseId: string) =>
    http.post('/interacts/hearts', { id: courseId, target_resource: 'course' }),

  rating: (body: RatingBodyType) =>
    http.post('-public/courses/actions/rate', body),

  comment: (body: any) => http.post('-public/courses/actions/comment', body),

  editComment: (id: string, body: any) =>
    http.patch(`-public/courses/actions/comment/${id}`, body),

  deleteComment: (id: string) =>
    http.delete(`-public/courses/actions/comment/${id}`),

  reactAction: (body: any) => http.post('-public/courses/actions/emoji', body),
}
