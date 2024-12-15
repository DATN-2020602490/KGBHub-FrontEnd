import QUERY_KEYS from '@/constants/query-keys'
import campaignService from '@/services/campaign.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCampaigns = (params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_CAMPAIGNS],
    queryFn: () => campaignService.getList(params),
  })
}

export const useMyPromotions = (params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MY_PROMOTIONS],
    queryFn: () => campaignService.getMyPromotion(),
  })
}

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => campaignService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIST_CAMPAIGNS],
      })
    },
  })
}

export const useJoinCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (campaignId: string) => campaignService.join({ campaignId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIST_CAMPAIGNS],
      })
    },
  })
}

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: any) => campaignService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIST_CAMPAIGNS],
      })
    },
  })
}
