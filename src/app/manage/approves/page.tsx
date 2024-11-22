'use client'

import { Tab, Tabs } from '@nextui-org/react'
import dynamic from 'next/dynamic'
const ApprovesLessonsTable = dynamic(
  () => import('@/app/manage/approves/_components/approve-lesson-table'),
  { ssr: false }
)
const ApprovesCoursesTable = dynamic(
  () => import('@/app/manage/approves/_components/approves-courses-table'),
  { ssr: false }
)

const ApprovesPage = () => {
  return (
    <Tabs
      aria-label="Options"
      classNames={{
        base: 'w-full mt-4',
        tabList: 'w-full max-w-full',
      }}
      color="primary"
    >
      <Tab key="courses" title="Courses">
        <ApprovesCoursesTable />
      </Tab>
      <Tab key="lessons" title="Lectures">
        <ApprovesLessonsTable />
      </Tab>
    </Tabs>
  )
}

export default ApprovesPage
