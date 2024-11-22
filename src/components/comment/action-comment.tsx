'use client'
import { TARGET_RESOURCE } from '@/constants'
import { useAccountContext } from '@/contexts/account'
import { generateMediaLink } from '@/lib/utils'
import {
  useCommentMutation,
  useUpdateCommentMutation,
} from '@/queries/useInteract'
import { Avatar, Button, Textarea } from '@nextui-org/react'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  postId: string
  level: number
  parentId?: string
  defaultValue?: string
  onCancel?: () => void
  action?: 'create' | 'edit'
  type?: 'course' | 'lesson'
  placeholder?: string
}

const ActionComment = ({
  postId,
  level,
  parentId = '',
  defaultValue,
  onCancel,
  action = 'create',
  type = 'course',
  placeholder = 'Enter your comment here...',
}: Props) => {
  const { user } = useAccountContext()
  const updateCommentMutation = useUpdateCommentMutation()
  const commentMutation = useCommentMutation()
  const isAuth = !!user?.email
  const [comment, setComment] = React.useState(defaultValue)
  const handleComment = async () => {
    try {
      const data =
        type === 'course'
          ? {
              id: postId,
              level,
              content: comment!,
              parentId,
              target_resource: TARGET_RESOURCE.COURSE,
            }
          : {
              id: postId,
              level,
              content: comment!,
              parentId,
              target_resource: TARGET_RESOURCE.LESSON,
            }
      const res = await commentMutation.mutateAsync(data)

      if (res) {
        toast.success('your comment has been added')
        setComment('')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleUpdateComment = async () => {
    try {
      const res = await updateCommentMutation.mutateAsync({
        id: postId,
        body: { content: comment ?? '' },
      })
      toast.success('your comment has been added')
      setComment('')
      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      console.log(error)
    }
  }
  if (!isAuth) return null
  return (
    <>
      <div className="flex gap-2">
        <div>
          <Avatar
            size="sm"
            className={level > 0 ? 'scale-85' : ''}
            src={generateMediaLink(user?.avatarFileId ?? '')}
          />
        </div>
        <Textarea
          variant="faded"
          placeholder={placeholder}
          className="w-full mb-2"
          value={comment}
          onValueChange={setComment}
        />
      </div>
      {action === 'create' ? (
        <Button
          className="ml-auto block"
          onClick={handleComment}
          color="primary"
        >
          Comment
        </Button>
      ) : (
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleUpdateComment} color="primary">
            Update
          </Button>
        </div>
      )}
    </>
  )
}

export default ActionComment
