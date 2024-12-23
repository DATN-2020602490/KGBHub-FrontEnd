'use client'

import BookmarkLesson from '@/app/(public)/learning/_components/bookmark-lesson'
import { Heading } from '@/components/common/heading'
import { useCourse } from '@/contexts/course'
import { generateMediaLink } from '@/lib/utils'
import { lessonPublicApiRequest } from '@/services/lesson.service'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

type Props = {
  data?: any
}

const LearningVideoLesson = ({ data }: Props) => {
  const { setCourseRefresh, progress } = useCourse()
  const { courseId } = useParams()
  const [videoURL, setVideoURL] = React.useState('')
  const courseProgress = progress?.find(
    (course: any) => course.courseId === Number(courseId)
  )

  useEffect(() => {
    ;(async function fetchLesson() {
      try {
        if (data.lessonName) {
          const url = generateMediaLink(data.videoFileId ?? '')
          const accessToken = localStorage.getItem('accessToken')
          const videoUrlWithAuth = `${url}?token=${accessToken}`
          setVideoURL(videoUrlWithAuth)
        }
      } catch (error) {}
    })()
  }, [JSON.stringify(data)])
  const finishedLesson = async () => {
    try {
      if (courseProgress?.lessons.some((l: any) => l.lessonId === data.id))
        return
      const res = await lessonPublicApiRequest.finish(data.id)
      if (res.status === 200) {
        toast.success('Lesson finished', { hideProgressBar: true })
        setCourseRefresh((prev: boolean) => !prev)
      }
    } catch (error) {}
  }
  return (
    <div>
      <video
        className="VideoInput_video rounded-md aspect-video"
        width="100%"
        height={400}
        controls
        src={videoURL}
        onEnded={finishedLesson}
      />
      <div className="flex gap-2 items-center">
        <Heading title={data.lessonName} className="text-2xl" />
        <BookmarkLesson />
      </div>
      <p>{data.descriptionMD}</p>
    </div>
  )
}

export default LearningVideoLesson
