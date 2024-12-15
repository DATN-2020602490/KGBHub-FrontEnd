import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { EntityError } from '@/lib/http'
import { toast } from 'react-toastify'
import { sanitizeConfiguration } from '@/constants/sanitizeConfig'
import sanitizeHtml from 'sanitize-html'
import { urlRegex } from '@/lib/regex'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message,
      })
    })
  } else {
    toast.error(error?.payload?.message ?? 'Lỗi không xác định')
  }
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload
}

export const convertExpiresJWT = (time: number) =>
  new Date(Date.now() + time).toUTCString()

export const generateMediaLink = (media?: string) => {
  if (!media) return ''
  if (media.startsWith('http')) return media
  return `${process.env.NEXT_PUBLIC_API_BASE}/files/${media.replace(
    /^uploads\//,
    ''
  )}`
}

export const convertObjectToFormData = (data: any) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  return formData
}

export const displayFullname = (firstName?: string, lastName?: string) =>
  (firstName ? firstName : '') +
  (firstName && lastName ? ' ' : '') +
  (lastName ? lastName : '')

export const formatDuration = (duration: number) => {
  let seconds = Math.floor(duration % 60)
  let minutes = Math.floor(duration / 60) % 60
  let hours = Math.floor(duration / 3600) % 24
  let days = Math.floor(duration / 86400)
  let result = ''

  if (days) {
    result += days > 1 ? days + 'd ' : '1d '
  }

  if (hours) {
    result += hours > 1 ? hours + 'h ' : '1h '
  }

  if (minutes) {
    result += minutes > 1 ? minutes + 'm ' : '1m '
  }

  if (seconds) {
    result += seconds > 1 ? seconds + 's' : '1s'
  }

  return result.trim() || '0s'
}

export const formatVideoDuration = (duration: number) => {
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = Math.ceil(duration % 60)

  if (hours < 1) {
    let minutesStr = String(minutes).padStart(2, '0')
    let secondsStr = String(seconds).padStart(2, '0')
    return minutesStr + ':' + secondsStr
  } else {
    let hoursStr = String(hours).padStart(2, '0')
    let minutesStr = String(minutes).padStart(2, '0')
    return hoursStr + ':' + minutesStr
  }
}

export const isClient = () => typeof window !== 'undefined'

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const sanitizer = (text: string, config?: any) =>
  sanitizeHtml(text, config || sanitizeConfiguration)

export const contentUrlFormater = (content: string) => {
  const splitedContent = content.split(' ')
  const formattedContent = splitedContent.map((word) => {
    if (urlRegex.test(word)) {
      return `<a href='${word}' target='_blank' class="hyper-link">${word}<a/>`
    }
    return word
  })
  return formattedContent.join(' ')
}
export function formatBytes(bytes: any, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
