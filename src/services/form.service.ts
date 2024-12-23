import http from '@/lib/http'
import { SubmitForm } from '@/models'

export const formApiRequest = {
  get: (formId: string) => http.get<SubmitForm>(`/forms/${formId}`),

  getList: (params: string) =>
    http.get<SubmitForm[]>('/forms' + params, {
      cache: 'no-store',
    }),

  update: (formId: number, body: any) => http.patch(`/forms/${formId}`, body),
}
