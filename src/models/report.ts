import { User } from '@/models'

export type ReportData = {
  [dateKey: string]: {
    totalOriginalAmount: number
    totalAmount: number
    totalOrder: number
    totalFee?: number // just show in system
    totalTip?: number // just show in system
  }
}

export type ReportTable = {
  author: User
  groupBy: string
  startDate: number | Date
  endDate: number | Date
  target: 'system' | 'author'
  authorId?: string
  systemReport?: ReportData
  authorReport?: ReportData
}
