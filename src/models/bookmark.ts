import { Course, Lesson, User } from '@/models'

export type Bookmark = {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  user: User
  userId: string

  lesson?: Lesson
  lessonId?: string
  course?: Course
  courseId?: string
}
