'use client'
import AuthorTab from '@/app/manage/dashboard/_components/author-tab'
import SystemTab from '@/app/manage/dashboard/_components/system-tab'
import { Heading } from '@/components/common/heading'
import { HomeIcon } from '@/components/icons/sidebar/home-icon'
import { RoleEnum } from '@/constants'
import { useAccountContext } from '@/contexts/account'
import { Tab, Tabs } from '@nextui-org/react'

const Page = () => {
  const { user } = useAccountContext()
  const isAdmin = user?.roles.some((role) => role.role.name === RoleEnum.ADMIN)
  return (
    <>
      <Heading title="Dashboard" icon={<HomeIcon />} />
      <Tabs
        aria-label="Report"
        className={isAdmin ? 'mt-4' : 'hidden'}
        defaultSelectedKey={isAdmin ? 'systems' : 'author'}
      >
        <Tab key="systems" title="Systems">
          <SystemTab />
        </Tab>
        <Tab key="author" title="Author">
          <AuthorTab />
        </Tab>
      </Tabs>
    </>
  )
}

export default Page
