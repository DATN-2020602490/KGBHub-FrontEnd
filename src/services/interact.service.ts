import http from '@/lib/http'
import { Comment, TargetResourceType } from '@/models'

export type CommentBodyType = {
  id: string
  target_resource: TargetResourceType
  level: number
  content: string
  parentId?: string
}

export type InteractResType = {
  comments: Comment[]
  commentsCount: number
  isHearted: boolean
  hearsCount: number
}

export const interactApiRequest = {
  get: ({
    id,
    target_resource,
    limit,
    offset,
  }: {
    id: string
    target_resource: TargetResourceType
    limit?: number
    offset?: number
  }) => {
    const queryParams = new URLSearchParams({
      id,
      target_resource,
      ...(limit !== undefined && { limit: limit.toString() }),
      ...(offset !== undefined && { offset: offset.toString() }),
    }).toString()

    return http.get<InteractResType>(`/interacts?${queryParams}`)
  },

  heart: (body: { id: string; target_resource: string }) =>
    http.post('/interacts/comments', body),

  comment: (body: CommentBodyType) => http.post('/interacts/comments', body),

  updateComment: (id: string, body: { content: string }) =>
    http.patch(`/interacts/comments/${id}`, body),

  deleteComment: (id: string) => http.delete(`/interacts/comments/${id}`),

  voteComment: (body: { commentId: string; isUp: boolean }) =>
    http.post(`/interacts/vote-comment`, body),
}
