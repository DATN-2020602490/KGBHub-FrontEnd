import http from '@/lib/http'
import { Lesson } from '@/models'
import {
  LessonTextBodyType,
  LessonVideoBodyType,
} from '@/schemaValidations/lesson.schema'

export type LessonBodyType = LessonTextBodyType | LessonVideoBodyType | FormData

export const lessonManagerApiRequest = {
  create: (body: LessonBodyType) => http.post(`/lessons`, body),

  get: (lessonId: string) => http.get(`/lessons/${lessonId}`),

  getList: (params?: string) => http.get<Lesson[]>(`/lessons?${params}`),

  update: (lessonId: string, body: LessonBodyType) =>
    http.patch(`/lessons/${lessonId}`, body),

  delete: (lessonId: string) => http.delete(`/lessons/${lessonId}`),

  approve: (lessonId: string) =>
    http.patch(`/lessons/${lessonId}/actions/approve`, undefined),
}

export const lessonPublicApiRequest = {
  get: (lessonId: string) => http.get<Lesson>(`-public/lessons/${lessonId}`),

  heart: (body: any) => http.post('-public/lessons/actions/heart', body),

  buy: (body: any) => http.post('-public/lessons/actions/buy', body),

  comment: (body: any) => http.post('-public/lessons/actions/comment', body),

  editComment: (lessonId: string, body: any) =>
    http.patch(`-public/lessons/actions/comment/${lessonId}`, body),

  deleteComment: (lessonId: string) =>
    http.delete(`-public/lessons/actions/comment/${lessonId}`),

  emojiAction: (body: any) => http.post('-public/lessons/actions/emoji', body),

  finish: (lessonId: string) =>
    http.post('-public/lessons/actions/done', { lessonId }),
}
