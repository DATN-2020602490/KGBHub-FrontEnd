import QUERY_KEYS from '@/constants/query-keys'
import chatApiRequest from '@/services/chat.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useListConversations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_CONVERSATIONS],
    queryFn: () => chatApiRequest.getList(),
  })
}

export const useCreateConversationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { userIds: string[] }) => chatApiRequest.cretae(body),
  })
}
