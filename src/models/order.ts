import { Course, CoursesPaid, User, Voucher } from '@/models'

export const Currency = {
  USD: 'USD',
} as const
export type Currency = (typeof Currency)[keyof typeof Currency]

export const OrderStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const PaymentPlatform = {
  STRIPE: 'STRIPE',
} as const

export type PaymentPlatform =
  (typeof PaymentPlatform)[keyof typeof PaymentPlatform]

export const ProductStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

export const ProductType = {
  BEING_DONATED: 'BEING_DONATED',
  COURSE: 'COURSE',
  KGBHUB_SERVICE_TIP: 'KGBHUB_SERVICE_TIP',
  STRIPE_SERVICE_FEE: 'STRIPE_SERVICE_FEE',
} as const

export type ProductType = (typeof ProductType)[keyof typeof ProductType]

export type ProductOrder = {
  id: string
  productId: string
  product: Product
  price: number
  quantity: number
  orderId: string
  order: Order

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type Product = {
  id: string
  status: ProductStatus
  type: ProductType
  name: string
  description?: string
  period?: number
  price: number
  currency: Currency
  images: string[]

  course?: Course
  courseId?: string

  productStripeId?: string
  productOrders: ProductOrder[]

  tags: string[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type Order = {
  id: string
  userId: string
  user: User
  productOrders: ProductOrder[]

  status: OrderStatus
  amount: number
  currency: Currency
  checkoutUrl?: string
  vouchers: Voucher[]

  platform: PaymentPlatform

  platformFee: number

  KGBHubServiceTip: number

  stripeCheckoutId?: string
  stripePriceId?: string
  stripeSubscriptionId?: string

  coursesPaids: CoursesPaid[]

  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  referredBy?: User
  referredById?: string
}
