import { Bookmark, Heart, Part, User } from '@/models'

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
}

export enum LessonStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  UPLOADING_TO_YOUTUBE = 'UPLOADING_TO_YOUTUBE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export type LessonDone = {
  id: string

  lesson: Lesson
  lessonId: string
  user: User
  userId: string
}

export type Lesson = {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  lessonName: string
  lessonNumber: number

  lessonType: LessonType

  trialAllowed: boolean
  descriptionMD?: string

  status: LessonStatus

  title?: string
  content?: string

  videoFileId?: string
  videoFile?: File

  thumbnailFileId?: string
  thumbnailFile?: File

  user: User
  userId: string
  duration: number
  comments: Comment[]
  hearts: Heart[]
  bookmarks: Bookmark[]
  part: Part
  partId: string
  lessonDones: LessonDone[]
}
