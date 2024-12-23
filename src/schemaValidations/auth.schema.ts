import { User } from '@/models'
import z from 'zod'

// Register
export const RegisterBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterResponse = z.object({
  data: z.object({
    email: z.string().email(),
  }),
  message: z.string(),
})

export type RegisterResponseType = z.TypeOf<typeof RegisterResponse>

// Login
export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.string(),
    password: z.null(),
    salt: z.null(),
    phone: z.string(),
    avatar: z.string(),
    birthday: z.string(),
    isVerified: z.boolean(),
    verifyCode: z.null(),
    platform: z.string(),
    refreshToken: z.string(),
    firstTime: z.boolean(),
    isNewUser: z.boolean(),
    timestamp: z.string(),
    roles: z.array(
      z.object({
        id: z.string(),
        timestamp: z.string(),
        roleId: z.string(),
        userId: z.string(),
        role: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
        }),
      })
    ),
  }),
})

export type LoginResponseType = {
  accessToken: string
  refreshToken: string
  data: User
}
export type TokensType = {
  accessToken: string
  refreshToken: string
}

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>
