'use client'
import CourseForm from '@/components/course/course-form'
import ListPartsAccordion from '@/components/course/list-parts-accordion'
import { Course } from '@/models'
import { Chip, Tab, Tabs } from '@nextui-org/react'
import { File, ListOrdered } from 'lucide-react'
type Props = {
  courseData: Course
}

const CreateTabs = ({ courseData }: Props) => {
  return (
    <Tabs
      aria-label="Options"
      color="primary"
      variant="underlined"
      classNames={{
        tabList:
          'gap-6 w-full relative rounded-none p-0 border-b border-divider',
        cursor: 'w-full',
        tab: 'max-w-fit px-0 h-12',
        tabContent: '',
      }}
    >
      <Tab
        key="course"
        title={
          <div className="flex items-center space-x-2">
            <File />
            <span>Course information</span>
          </div>
        }
      >
        <CourseForm defaultValues={courseData} />
      </Tab>
      <Tab
        key="part"
        title={
          <div className="flex items-center space-x-2">
            <ListOrdered />
            <span>Course Parts</span>
            <Chip size="sm" variant="faded">
              {courseData.parts.length}
            </Chip>
          </div>
        }
      >
        <ListPartsAccordion
          isAuth
          data={courseData.parts.sort((a, b) => a.partNumber - b.partNumber)}
        />
      </Tab>
    </Tabs>
  )
}

export default CreateTabs
