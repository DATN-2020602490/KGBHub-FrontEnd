import { CoursesOnCarts, User } from '@/models'

export type Cart = {
  id: string

  user: User
  userId: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  coursesOnCarts: CoursesOnCarts[]
}
