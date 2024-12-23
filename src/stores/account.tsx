'use client'

import { create } from 'zustand'
import { Course, User } from '@/models'
import { authApiRequest } from '@/services/auth.service'
import { userApiRequest } from '@/services/user.service'

interface AccountState {
  user: User | undefined | null
  coursesBought: Course[]
  coursesHearted: any[]
  initDone: boolean
  updateUser: (data: any) => void
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  getCoursesBought: () => Promise<void>
  getCoursesHearted: () => Promise<void>
  initializeUser: () => void
}

export const useAccountStore = create<AccountState>((set, get) => ({
  user: undefined,
  coursesBought: [],
  coursesHearted: [],
  initDone: false,

  updateUser: (data) => {
    localStorage.setItem('user', JSON.stringify(data))
    set({ user: data || null })
  },

  logout: async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    set({ user: null })
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken') as string
    const data = await authApiRequest.refreshToken({ refreshToken })
    const { accessToken, newRefreshToken } = data.payload
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  },

  getCoursesBought: async () => {
    try {
      const user = get().user
      if (user?.id) {
        const res = await userApiRequest.getCourseBought()
        if (res.status === 200) {
          set({ coursesBought: res.payload })
        }
      }
    } catch (error) {
      console.error(error)
    }
  },

  getCoursesHearted: async () => {
    try {
      const user = get().user
      if (user?.id) {
        const res = await userApiRequest.getWishList()
        if (res.status === 200) {
          set({ coursesHearted: (res.payload as any).courseHearted })
        }
      }
    } catch (error) {
      console.error(error)
    }
  },

  initializeUser: () => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      const me: User = JSON.parse(localStorage.getItem('user') as string)
      set({ user: me || null })
    }
    set({ initDone: true })
  },
}))
