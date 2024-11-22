import QUERY_KEYS from '@/constants/query-keys'
import {
  LessonBodyType,
  lessonManagerApiRequest,
  lessonPublicApiRequest,
} from '@/services/lesson.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useListLessonManager = (params?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_LESSONS_MANAGER],
    queryFn: () => lessonManagerApiRequest.getList(params),
  })
}

export const useLessonPublic = (lessonId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LESSONS_PUBLIC, lessonId],
    queryFn: () => lessonPublicApiRequest.get(lessonId),
  })
}

export const useCreateLessonMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: LessonBodyType) => lessonManagerApiRequest.create(body),
    onSuccess: (data: any) => {
      console.log('refresh: ', data)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_DETAIL_COURSE, data.payload.courseId],
        exact: true,
      })
    },
  })
}

export const useUpdateLessonMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: LessonBodyType }) =>
      lessonManagerApiRequest.update(id, body),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_DETAIL_COURSE, data.payload.courseId],
        exact: true,
      })
    },
  })
}

export const useApproveLessonMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lessonManagerApiRequest.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIST_LESSONS_MANAGER],
      })
    },
  })
}
