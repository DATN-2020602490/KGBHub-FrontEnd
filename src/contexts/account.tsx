'use client'
import { User } from '@/models'
import { authApiRequest } from '@/services/auth.service'
import { userApiRequest } from '@/services/user.service'
import { createContext, useContext, useEffect, useState } from 'react'

interface IContext {
  user: User | undefined | null
  updateUser: (value: any) => void
  coursesBought: any
  setCoursesBought: (courses: any) => void
  coursesHearted: any
  setCoursesHearted: (courses: any) => void
  logout: () => void
  refreshToken: () => void
}

const AccountContext = createContext<IContext>({
  user: undefined,
  updateUser: () => undefined,
  coursesBought: [],
  setCoursesBought: () => {},
  coursesHearted: [],
  setCoursesHearted: () => {},
  logout: () => {},
  refreshToken: () => {},
})
export const useAccountContext = () => {
  const context = useContext(AccountContext)
  return context
}
export default function AccountProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | undefined | null>(undefined)
  const [initDone, setInitDone] = useState(false)
  const [coursesBought, setCoursesBought] = useState<any>([])
  const [coursesHearted, setCoursesHearted] = useState<any>([])

  const updateUser = (data: any) => {
    localStorage.setItem('user', JSON.stringify(data) as string)
    setUser(data || null)
  }
  const logout = async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken') as string
    const data = await authApiRequest.refreshToken({ refreshToken })
    const { accessToken, newRefreshToken } = data.payload
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  async function getCoursesBought() {
    try {
      if (user?.id) {
        const res = await userApiRequest.getCourseBought()
        if (res.status === 200) {
          setCoursesBought(res.payload)
        }
      }
    } catch (error) {}
  }
  async function getCoursesHearted() {
    try {
      if (user?.id) {
        const res = await userApiRequest.getWishList()
        if (res.status === 200) {
          setCoursesHearted((res.payload as any).courseHearted)
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    const acessToken = localStorage.getItem('accessToken')
    if (acessToken) {
      const me: User = JSON.parse(localStorage.getItem('user') as string)
      // const { payload: data } = await userApiRequest.get(me.id)
      setUser(me || null)
    }
    setInitDone(true)
  }, [!!user])

  // const fetchUserData = async () => {
  //   try {
  //     const acessToken = localStorage.getItem('accessToken')
  //     if (acessToken) {
  //       const me: User = JSON.parse(localStorage.getItem('user') as string)
  //       // const { payload: data } = await userApiRequest.get(me.id)
  //       setUser(me || null)
  //     }
  //     setInitDone(true)
  //   } catch (error) {
  //     setInitDone(true)
  //   }
  // }

  if (!initDone) {
    return <></>
  }
  return (
    <AccountContext.Provider
      value={{
        updateUser,
        user,
        coursesBought,
        setCoursesBought,
        coursesHearted,
        setCoursesHearted,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
