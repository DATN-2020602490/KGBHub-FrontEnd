import {
  Bookmark,
  Cart,
  Comment,
  Conversation,
  Currency,
  Heart,
  Lesson,
  Order,
  Product,
  Rating,
  User,
} from '@/models'

export const CourseStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
} as const
export type CourseStatus = (typeof CourseStatus)[keyof typeof CourseStatus]

export const CourseCategory = {
  DEVELOPMENT: 'DEVELOPMENT',
  BUSINESS: 'BUSINESS',
  DESIGN: 'DESIGN',
  MARKETING: 'MARKETING',
  IT: 'IT',
  PERSONAL_DEVELOPMENT: 'PERSONAL_DEVELOPMENT',
  PHOTOGRAPHY: 'PHOTOGRAPHY',
  MUSIC: 'MUSIC',
  HEALTH: 'HEALTH',
  FITNESS: 'FITNESS',
  LIFESTYLE: 'LIFESTYLE',
  TEACHING: 'TEACHING',
  ACADEMICS: 'ACADEMICS',
  LANGUAGE: 'LANGUAGE',
  OTHER: 'OTHER',
} as const
export type CourseCategory =
  (typeof CourseCategory)[keyof typeof CourseCategory]

export type CoursesPaid = {
  id: string

  course: Course
  courseId: string
  user: User
  userId: string

  order: Order
  orderId: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type CoursesOnCarts = {
  id: string

  course: Course
  courseId: string

  addedAt: Date

  cart: Cart
  cartId: string
}

export type CourseDone = {
  id: string

  course: Course
  courseId: string
  user: User
  userId: string
}

export type Part = {
  id: string
  partNumber: number
  partName: string
  description?: string

  lessons: Lesson[]

  course: Course
  courseId: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type Course = {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  totalLesson: number
  totalPart: number
  courseName: string
  totalDuration: number
  knowledgeGained: string[]
  isPublic: boolean
  status: CourseStatus

  avgRating?: number
  totalRating: number

  thumbnailFileId?: string
  thumbnailFile?: File

  category: CourseCategory

  priceAmount: number
  currency: Currency

  descriptionMD?: string

  user: User
  userId: string

  // lessons      Lesson[]
  comments: Comment[]
  hearts: Heart[]
  parts: Part[]

  coursesPaid: CoursesPaid[]
  bookmarks: Bookmark[]
  courseDones: CourseDone[]
  coursesOnCarts: CoursesOnCarts[]
  products: Product[]
  Conversation: Conversation[]
  totalBought?: number
  isBought?: boolean
  isHearted?:boolean
  currentLessonId?: string
  myRating?: Rating
  process?: number
}
