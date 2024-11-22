import { authApiRequest } from '@/services/auth.service'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: 'Can not get access/refresh token' },
      {
        status: 200,
      }
    )
  }
  try {
    const result = await authApiRequest.logout(accessToken)
    return Response.json(result.payload)
  } catch (error) {
    return Response.json(
      {
        message: 'Error when call api to backend server',
      },
      {
        status: 200,
      }
    )
  }
}
