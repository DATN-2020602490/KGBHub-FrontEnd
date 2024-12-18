import QUERY_KEYS from '@/constants/query-keys'
import { userApiRequest } from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER, userId],
    queryFn: () => userApiRequest.get(userId),
  })
}

export const useSearchUserQuery = (keyword: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USER, keyword],
    queryFn: () => userApiRequest.search(keyword),
  })
}
