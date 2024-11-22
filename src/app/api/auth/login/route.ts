import jwt from 'jsonwebtoken'
import { authApiRequest } from '@/services/auth.service'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json()
  const cookieStore = cookies()
  try {
    const { payload } = await authApiRequest.loginByGoogle(body)
    const { accessToken, refreshToken } = payload
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })
    return Response.json(payload)
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        { message: error.message },
        {
          status: 400,
        }
      )
    } else {
      return Response.json(
        { message: 'Unknown error' },
        {
          status: 500,
        }
      )
    }
  }
}
