import { RoleEnum } from '@/constants'
import {
  Attachment,
  Bookmark,
  CampaignUser,
  Cart,
  ChatMember,
  Course,
  CourseDone,
  CoursesPaid,
  Heart,
  Lesson,
  LessonDone,
  Order,
  Rating,
  SubmitForm,
} from '@/models'

export type Role = {
  id: string
  name: (typeof RoleEnum)[keyof typeof RoleEnum]
  description: string
  userRole: UserRole[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type UserRole = {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  role: Role
  roleId: string
  user: User
  userId: string
}

export type User = {
  id: string
  email: string
  username?: string
  firstName?: string
  lastName?: string
  gender?: string
  password?: string
  salt?: string
  roles: UserRole[]
  phone?: string
  address?: string
  avatarFileId?: string
  avatarFile?: File
  coverFileId?: string
  coverFile?: File
  birthday?: Date
  verifyCode?: string
  platform?: string
  refreshToken?: string
  firstTime: boolean
  isNewUser: boolean
  syncWithGoogle: boolean

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  comments: Comment[]
  hearts: Heart[]

  lessons: Lesson[]
  courses: Course[]

  coursesPaid: CoursesPaid[]
  submitForms: SubmitForm[]
  rating: Rating[]
  bookmarks: Bookmark[]
  lessonDones: LessonDone[]
  courseDones: CourseDone[]

  lastReset?: Date
  cart: Cart[]

  orders: Order[]
  referredOrders: Order[]
  chatMembers: ChatMember[]
  attachments: Attachment[]
  files: File[]
  campaignUsers: CampaignUser[]
}
