import { CourseCategory, User } from '@/models'

export const FormStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const
export type FormStatus = (typeof FormStatus)[keyof typeof FormStatus]

export type SubmitForm = {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  user: User
  userId: string

  real_firstName: string
  real_lastName: string

  selfie?: string

  frontIdCard?: string
  backIdCard?: string

  linkCV?: string

  category: CourseCategory

  status: FormStatus
}
