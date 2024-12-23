'use client'
import FormTabs from '@/app/manage/forms/_components/form-tabs'
import { Heading } from '@/components/common/heading'
import { UpgradeRole } from '@/components/icons/sidebar/updarade-role'
import { useListUpRoleRequest } from '@/queries/useUpRole'

const Page = () => {
  const { data } = useListUpRoleRequest('')

  return (
    <>
      <Heading icon={<UpgradeRole />} title="Form request" />
      {data && <FormTabs data={data?.payload} />}
    </>
  )
}

export default Page
