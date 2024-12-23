'use client'
import { Heading } from '@/components/common/heading'
import { ViewIcon } from '@/components/icons/sidebar/view-icon'
import { useListCourseManager } from '@/queries/useCourse'
import ManageCourseTable from '@/app/manage/courses/_components/manage-course-table'
import { useState } from 'react'
import CreateCourseModal from '@/components/modals/create-course-modal'

type Props = {
  searchParams?: { [key: string]: string | undefined }
}

const LIMIT = 12

const MyCoursePage = ({ searchParams }: Props) => {
  const { page } = searchParams as { page: string }
  const [offset, setOffset] = useState(0)

  const { data, isLoading } = useListCourseManager(
    `limit=${LIMIT}&offset=${offset}`
  )
  if (isLoading) return null
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading icon={<ViewIcon />} title="My Courses" />
        <CreateCourseModal />
      </div>
      {/* <div className="p-5 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        {(parseInt(page as string) < 2 || !page) && <CreateCourseModal />}
        {listCourses.courses.map((course: any, index: number) => (
          <CourseCard isAuth key={index} data={course} />
        ))}
      </div> */}

      {isLoading ? null : <ManageCourseTable data={data?.payload} />}
    </>
  )
}

export default MyCoursePage
