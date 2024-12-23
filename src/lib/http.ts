import { normalizePath } from '@/lib/utils'
import { Pagination } from '@/models'
import { LoginResponseType } from '@/schemaValidations/auth.schema'
import { redirect } from 'next/navigation'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({
    status,
    payload,
    message = 'Http Error',
  }: {
    status: number
    payload: any
    message?: string
  }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS
    payload: EntityErrorPayload
  }) {
    super({ status, payload, message: 'Entity Error' })
    this.status = status
    this.payload = payload
  }
}

let clientLogoutRequest: null | Promise<any> = null
const isClient = typeof window !== 'undefined'
const request = async <Response, Option = undefined>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }
  const baseHeaders: {
    [key: string]: string
  } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
        }
  if (isClient) {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_BASE
      : options.baseUrl

  const fullUrl = `${baseUrl}${url}`
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  })
  const payload = await res.json()
  const data = {
    status: res.status,
    payload: payload.data as Response,
    pagination: payload?.pagination as Pagination,
    option: payload?.option as Option,
  }
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            } as any,
          })
          try {
            await clientLogoutRequest
          } catch (error) {
          } finally {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            clientLogoutRequest = null
            location.href = '/login'
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split(
          'Bearer '
        )[1]
        redirect(`/logout?accessToken=${accessToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    if (
      ['auth/login', 'auth/register'].some(
        (item) => item === normalizePath(url)
      )
    ) {
      const { accessToken, refreshToken } = payload as LoginResponseType
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    } else if ('auth/logout' === normalizePath(url)) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
  return data
}

const http = {
  get<Response, Option = undefined>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response, Option>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PATCH', url, { ...options, body })
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, { ...options })
  },
}

export default http
