import QUERY_KEYS from '@/constants/query-keys'
import { cartApiRequest } from '@/services/cart.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useMyCart = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MY_CART],
    queryFn: () => cartApiRequest.get(),
  })
}

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MY_CART],
      })
    },
  })
}

export const useRemoveToCartMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApiRequest.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MY_CART],
      })
    },
  })
}

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApiRequest.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MY_CART],
      })
    },
  })
}
