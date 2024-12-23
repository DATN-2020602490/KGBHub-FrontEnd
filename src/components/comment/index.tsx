'use client'
import ActionComment from '@/components/comment/action-comment'
import Comment from '@/components/comment/comment'
import { useSearchParams } from 'next/navigation'
import { useInteractQuery } from '@/queries/useInteract'

type Props = {
  // data: CommentType[]
  postId: string
}

const CommentSection = ({ postId }: Props) => {
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson')
  const type = lessonId ? 'lesson' : 'course'
  // const [comments, setComments] = useState<any>([])
  const { data, isLoading } = useInteractQuery({
    id: postId,
    target_resource: type,
  })
  if (isLoading) return null
  // const dataSorted = [...data!.payload.comments].sort(
  //   (a: CommentType, b: CommentType) =>
  //     new Date(b.createdAt as string).getTime() -
  //     new Date(a.createdAt as string).getTime()
  // )
  const comments = data!.payload
  const parentComments = comments.filter((comment) => comment.level === 0)
  return (
    <div>
      <ActionComment postId={postId} level={0} type={type} />
      <div className="space-y-4">
        {parentComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            data={comments}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection
