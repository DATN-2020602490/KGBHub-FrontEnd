'use client'

import LearningDocumentLesson from '@/app/(public)/learning/_components/learning-document-lesson'
import LearningVideoLesson from '@/app/(public)/learning/_components/learning-video-lesson'
import CommentSection from '@/components/comment'
import { Heading } from '@/components/common/heading'
import { Lesson } from '@/models'

type Props = {
  data: Lesson
}

const LearningContent = ({ data }: Props) => {
  return (
    <div className="w-3/5 mt-4">
      {data.lessonType === 'TEXT' ? (
        <LearningDocumentLesson data={data} />
      ) : (
        <LearningVideoLesson data={data} />
      )}
      <div className="space-y-4 mt-8">
        <Heading title="Comments" />
        <CommentSection postId={data.id} />
      </div>
    </div>
  )
}

export default LearningContent
