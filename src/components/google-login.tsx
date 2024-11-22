'use client'
import { useAccountContext } from '@/contexts/account'
import { useLoginMutation } from '@/queries/useAuth'
import { authApiRequest } from '@/services/auth.service'
import { Button } from '@nextui-org/react'
import { TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const GoogleLogin = () => {
  const { updateUser } = useAccountContext()
  const loginMutation = useLoginMutation()
  const router = useRouter()
  const loginByGooogleHandler = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      toast('success')
      const res = await loginMutation.mutateAsync({
        accessToken: tokenResponse.access_token,
      })
      const { accessToken, refreshToken } = res.payload
      await authApiRequest.auth({ accessToken, refreshToken })
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      updateUser(res.payload.data)
    },
  })
  return (
    <Button color="primary" onClick={() => loginByGooogleHandler()}>
      Login
    </Button>
  )
}

export default GoogleLogin
