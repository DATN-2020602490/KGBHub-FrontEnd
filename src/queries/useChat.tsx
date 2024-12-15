import QUERY_KEYS from '@/constants/query-keys'
import chatApiRequest from '@/services/chat.service'
import { useQuery } from '@tanstack/react-query'

export const useListConversations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_CONVERSATIONS],
    queryFn: () => chatApiRequest.getList(),
  })
}
