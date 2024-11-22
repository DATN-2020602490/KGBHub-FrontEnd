import { useMutation } from '@tanstack/react-query'
import { authApiRequest } from '@/services/auth.service'
import { TokensType } from '@/schemaValidations/auth.schema'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (body: Omit<TokensType, 'refreshToken'>) =>
      authApiRequest.loginByGoogle(body),
  })
}
