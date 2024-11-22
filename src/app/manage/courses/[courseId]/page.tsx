'use client'
import CreateTabs from '@/app/manage/courses/_components/create-tabs'
import { Heading } from '@/components/common/heading'
import { useDetailCourse } from '@/queries/useCourse'
import { FilePen } from 'lucide-react'

type Props = {
  params: { courseId: string }
}

const EditCoursePage = ({ params }: Props) => {
  const { data } = useDetailCourse(params.courseId)
  if (!data) return null
  const courseData = data.payload
  // const {payload} = await courseManagerApiRequests.get
  return (
    <>
      <Heading icon={<FilePen />} title="Edit course" />
      <div className="flex w-full flex-col p-5">
        <CreateTabs courseData={courseData} />
      </div>
    </>
  )
}

export default EditCoursePage
