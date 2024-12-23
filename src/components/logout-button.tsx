'use client'
import { useAccountContext } from '@/contexts/account'
import { authApiRequest } from '@/services/auth.service'
import { redirect, usePathname, useRouter } from 'next/navigation'

export default function ButtonLogout() {
  const { logout } = useAccountContext()
  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutByNextServer()
      // router.push('/login')
    } catch (error) {
      // handleErrorApi({
      //   error,
      // })
      authApiRequest.logout('')
      // .then((res) => {
      //   router.push(`/login?redirectFrom=${pathname}`)
      // })
    } finally {
      logout()
      // router.refresh()
      localStorage.removeItem('user')
      router.push("/")
    }
  }
  return (
    <span className="block w-full" onClick={handleLogout}>
      Log Out
    </span>
  )
}
