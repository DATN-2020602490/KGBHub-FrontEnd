import QUERY_KEYS from '@/constants/query-keys'
import { formApiRequest } from '@/services/form.service'
import { useQuery } from '@tanstack/react-query'

export const useListUpRoleRequest = (params: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_UP_ROLE, params],
    queryFn: () => formApiRequest.getList(params),
  })
}

export const useDetailUpRoleRequest = (formId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DETAIL_UP_ROLE_REQUEST, formId],
    queryFn: () => formApiRequest.get(formId),
  })
}
