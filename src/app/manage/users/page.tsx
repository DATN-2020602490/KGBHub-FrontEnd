import UsersTable from '@/app/manage/users/_components/users-table'
import { Heading } from '@/components/common/heading'
import { AccountsIcon } from '@/components/icons/sidebar/accounts-icon'
import { userApiRequest } from '@/services/user.service'
import { cookies } from 'next/headers'

const defaultParams = 'limit=10&offset=0'

const page = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string
  const { payload: listUser } = await userApiRequest.getList(
    defaultParams,
    accessToken
  )
  return (
    <>
      <Heading icon={<AccountsIcon />} title="Users" />
      <div className="p-5">
        <UsersTable data={listUser.users} />
      </div>
    </>
  )
}

export default page
