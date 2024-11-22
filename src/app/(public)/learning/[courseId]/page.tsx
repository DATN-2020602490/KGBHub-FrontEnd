'use client'
import LearningContent from '@/app/(public)/learning/_components/learning-content'
import LearningControl from '@/app/(public)/learning/_components/learning-control'
import LearningSidebar from '@/app/(public)/learning/_components/learning-sidebar'
import { useDetailCoursePublic } from '@/queries/useCourse'
import { useLessonPublic } from '@/queries/useLesson'

type Props = {
  params: {
    courseId: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

const LearningPage = ({ params, searchParams }: Props) => {
  const { courseId } = params
  const { lesson } = searchParams

  const { data: courseData } = useDetailCoursePublic(courseId)
  const parts = courseData?.payload.parts
  const { data: lessonData } = useLessonPublic(lesson as string)
  return (
    <>
      <div className="flex gap-x-10">
        {lessonData ? (
          <LearningContent data={lessonData?.payload} />
        ) : (
          <div className="w-3/5 mt-4 animate-pulse rounded-lg bg-slate-700"></div>
        )}
        {parts && <LearningSidebar data={parts} />}
      </div>
      <LearningControl data={parts} />
    </>
  )
}

export default LearningPage
