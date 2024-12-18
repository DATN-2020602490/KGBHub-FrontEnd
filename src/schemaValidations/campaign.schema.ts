import z from 'zod'

export const VoucherBody = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  cover: z.any(),
  totalFeeVoucher: z.string(),
  feeVoucherValue: z.string(),
  totalProductVoucher: z.string(),
  productVoucherValue: z.string(),
  startAt: z.any(),
  endAt: z.any(),
})

export type VoucherBodyType = z.infer<typeof VoucherBody>

export const DiscountBody = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  cover: z.any(),
  // courseIds: z.array(z.string()),
  startAt: z.any(),
  endAt: z.any(),
  requireJoined: z.any(),
})
export type DiscountBodyType = z.infer<typeof DiscountBody>
