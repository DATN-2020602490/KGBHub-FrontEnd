'use client'
import LearningContent from '@/app/(public)/learning/_components/learning-content'
import LearningControl from '@/app/(public)/learning/_components/learning-control'
import LearningSidebar from '@/app/(public)/learning/_components/learning-sidebar'
import { useDetailCoursePublic } from '@/queries/useCourse'
import { useLessonPublic } from '@/queries/useLesson'
import { CircularProgress } from '@nextui-org/react'

type Props = {
  params: {
    courseId: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

const LearningPage = ({ params, searchParams }: Props) => {
  const { courseId } = params
  const { lesson } = searchParams

  const { data: courseData, isLoading: isCourseLoading } =
    useDetailCoursePublic(courseId)
  const parts = courseData?.payload.parts
  const { data: lessonData } = useLessonPublic(lesson as string)
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {courseData?.payload.courseName}
        </h3>
        <div className="flex gap-x-2.5 my-2 items-center">
          <CircularProgress
            aria-label="Loading..."
            color="warning"
            showValueLabel={true}
            size="lg"
            value={courseData?.payload.process}
          />
          {!isCourseLoading && (
            <span className="text-sm">
              {Math.floor(
                ((courseData?.payload.totalLesson as number) *
                  (courseData?.payload.process as number)) /
                  100
              )}
              /{courseData?.payload.totalLesson} lessons
            </span>
          )}
        </div>
      </div>
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
