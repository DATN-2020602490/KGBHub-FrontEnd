import { Course, Order, User } from '@/models'

export const CampaignType = {
  VOUCHERS: 'VOUCHERS',
  DISCOUNT: 'DISCOUNT',
} as const
export type CampaignType = (typeof CampaignType)[keyof typeof CampaignType]

export const VoucherType = {
  PRODUCT_PERCENTAGE: 'PRODUCT_PERCENTAGE',
  FEE_PERCENTAGE: 'FEE_PERCENTAGE',
} as const
export type VoucherType = (typeof VoucherType)[keyof typeof VoucherType]

export type CampaignDiscount = {
  id: string

  campaign: Campaign
  campaignId: string

  discount: number

  courseId: string
  course: Course

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type CampaignUser = {
  id: string

  campaign: Campaign
  campaignId: string

  user: User
  userId: string
  voucher: Voucher[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type Voucher = {
  id: string

  type: VoucherType

  code: string

  value: number

  isUsed: boolean

  order?: Order
  orderId?: string

  campaign?: Campaign
  campaignId?: string

  campaignUser?: CampaignUser
  campaignUserId?: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type Campaign = {
  id: string

  type: CampaignType
  name: string
  description?: string
  coverFileId?: string
  startAt: Date
  endAt: Date
  active: boolean
  totalVoucher: number
  totalUsed: number

  campaignUsers: CampaignUser[]
  vouchers: Voucher[]
  campaignDiscounts: CampaignDiscount[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  isJoined?: boolean
}
