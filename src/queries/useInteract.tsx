import QUERY_KEYS from '@/constants/query-keys'
import { TargetResourceType } from '@/models'
import {
  CommentBodyType,
  interactApiRequest,
} from '@/services/interact.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useInteractQuery = (params: {
  id: string
  target_resource: TargetResourceType
  limit?: number
  offset?: number
}) => {
  const { id: postId, target_resource, limit, offset } = params
  return useQuery({
    queryKey: [QUERY_KEYS.GET_INTERACTS, postId],

    queryFn: () =>
      interactApiRequest.get({
        id: postId,
        target_resource,
        limit,
        offset,
      }),
  })
}

export const useListRates = (params: {
  courseId: string
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_RATES, params.courseId],
    queryFn: () => interactApiRequest.getRates(params),
  })
}

export const useCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CommentBodyType) => interactApiRequest.comment(body),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTERACTS, data.payload.lessonId],
      })
    },
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { content: string } }) =>
      interactApiRequest.updateComment(id, body),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.UPDATE_COMMENT, data.payload.lessonId],
      })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => interactApiRequest.deleteComment(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTERACTS, data.payload.lessonId],
      })
    },
  })
}

export const useVoteCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { commentId: string; isUp: boolean }) =>
      interactApiRequest.voteComment(body),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTERACTS, data.payload.lessonId],
      })
    },
  })
}

export const useHeartMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: any) => interactApiRequest.heart(body),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTERACTS, data.payload.lessonId],
      })
    },
  })
}

export const useRateCourseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: any) => interactApiRequest.rateCourse(body),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIST_RATES, data.payload.courseId],
      })
    },
  })
}
