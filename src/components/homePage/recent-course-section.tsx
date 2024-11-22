import CourseCard, { CourseCardSkeleton } from '@/components/course/course-card'
import { useListCoursePublic } from '@/queries/useCourse'

const RecentCourseSection = () => {
  const { data, isLoading } = useListCoursePublic()
  const recentCourses = data?.payload?.courses
  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {isLoading
        ? Array(8)
            .fill(null)
            .map((_, index) => <CourseCardSkeleton key={index} />)
        : recentCourses?.map((course) => (
            <CourseCard key={course.id} data={course} />
          ))}
    </div>
  )
}

export default RecentCourseSection
