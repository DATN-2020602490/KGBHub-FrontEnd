import QUERY_KEYS from '@/constants/query-keys'
import { userApiRequest } from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER, userId],
    queryFn: () => userApiRequest.get(userId),
  })
}
export const useListUsersQuery = (params: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_USERS, params],
    queryFn: () => userApiRequest.getList(params),
  })
}

export const useSearchUserQuery = (keyword: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USER, keyword],
    queryFn: () => (keyword ? userApiRequest.search(keyword) : undefined),
  })
}
export const useSearchAuthorQuery = (keyword: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_AUTHOR, keyword],
    queryFn: () => (keyword ? userApiRequest.searchAuthor(keyword) : undefined),
  })
}

export const useMyUpRoleRequest = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MY_UP_ROLE_REQUEST],
    queryFn: () => userApiRequest.getForm(),
  })
}
