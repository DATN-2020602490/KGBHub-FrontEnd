import { TARGET_RESOURCE } from '@/constants'
import { Course, Lesson, Message, User } from '@/models'

export type TargetResourceType =
  (typeof TARGET_RESOURCE)[keyof typeof TARGET_RESOURCE]

export type Heart = {
  id: string

  user: User
  userId: string

  lesson?: Lesson
  lessonId?: string
  course?: Course
  courseId?: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  message?: Message
  messageId?: string
}

export type Comment = {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  lesson?: Lesson
  lessonId?: string

  user: User
  userId: string

  level: number
  parentId?: string
  parent?: Comment
  children: Comment[]
}
