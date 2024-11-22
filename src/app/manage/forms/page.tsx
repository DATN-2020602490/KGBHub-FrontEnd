import FormTabs from '@/app/manage/forms/_components/form-tabs'
import { Heading } from '@/components/common/heading'
import { UpgradeRole } from '@/components/icons/sidebar/updarade-role'
import { formApiRequest } from '@/services/form.service'
import { cookies } from 'next/headers'

const page = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload } = await formApiRequest.getList(accessToken)

  return (
    <>
      <Heading icon={<UpgradeRole />} title="Form request" />
      <FormTabs data={payload} />
    </>
  )
}

export default page
