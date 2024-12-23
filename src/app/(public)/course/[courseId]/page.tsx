import CourseHeader from '@/app/(public)/course/_components/course-header'
import ListPartsAccordion from '@/components/course/list-parts-accordion'
import { formatDuration } from '@/lib/utils'
import { coursePublicApiRequests } from '@/services/course.service'
import { CircleCheckBig, Clock, FolderOpen, SquarePlay } from 'lucide-react'
import CourseSidebar from '@/app/(public)/course/_components/course-sidebar'
import RateSection from '@/app/(public)/course/_components/rate-section'
import { cookies } from 'next/headers'

type Props = {
  params: {
    courseId: string
  }
}

const page = async ({ params }: Props) => {
  const { courseId } = params
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload: courseData } = await coursePublicApiRequests.get(
    courseId,
    accessToken
  )
  // if (courseData?.isBought) {
  //   redirect(`/learning/${courseId}?lesson=${courseData?.currentLessonId}`)
  //   return
  // }
  const {
    id,
    knowledgeGained,
    descriptionMD,
    parts,
    avgRating,
    totalDuration,
    totalLesson,
    totalPart,
  } = courseData

  const partsData = parts.sort((a, b) => a.partNumber - b.partNumber)
  return (
    <>
      <CourseHeader data={courseData} />
      <div className=" flex flex-col-reverse lg:flex-row gap-8 justify-between w-full relative mt-4">
        <div className="lg:w-2/3 space-y-8">
          <div>
            <p className="text-2xl font-semibold">Description</p>
            <div
              className="entry-content"
              // Prevent XSS Attack recommen from React Docs
              dangerouslySetInnerHTML={{
                __html: descriptionMD ? descriptionMD : '',
              }}
            ></div>
          </div>
          <div className="p-5 bg-green-200 text-black rounded-md space-y-4">
            <p className="text-2xl font-semibold">
              What you will learn in this course
            </p>
            <ul className="grid lg:grid-cols-2 gap-4">
              {knowledgeGained.map((knowledge, index) => (
                <li key={index} className="flex">
                  <CircleCheckBig
                    className="stroke-green-500 mr-2 flex-shrink-0"
                    strokeWidth={2.5}
                    size={24}
                  />
                  <p>{knowledge}</p>
                </li>
              ))}
            </ul>
          </div>
          {parts && parts.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-semibold">Curriculum</p>
                <div className="flex gap-2 items-center">
                  <span className="flex gap-1 items-center">
                    <FolderOpen size={16} />
                    <p>{totalPart} parts</p>
                  </span>
                  <span className="flex gap-1 items-center">
                    <SquarePlay size={16} />
                    <p>{totalLesson} lectures</p>
                  </span>
                  <span className="flex gap-1 items-center">
                    <Clock size={16} />
                    <p>{formatDuration(totalDuration)}</p>
                  </span>
                </div>
              </div>
              <ListPartsAccordion data={partsData} />
            </div>
          )}
          <RateSection
            myRate={courseData?.myRating}
            canRate={courseData?.isBought}
          />
        </div>
        <CourseSidebar data={courseData} />
      </div>
    </>
  )
}

export default page
