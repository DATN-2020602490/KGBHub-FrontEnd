'use client'
import UsersTable from '@/app/manage/users/_components/users-table'
import { Heading } from '@/components/common/heading'
import { AccountsIcon } from '@/components/icons/sidebar/accounts-icon'
import { useListUsersQuery } from '@/queries/useUser'

const defaultParams = 'limit=10&offset=0'

const MangeUsersPage = () => {
  const { data: listUser } = useListUsersQuery('')
  return (
    <>
      <Heading icon={<AccountsIcon />} title="Users" />
      <div className="p-5">
        {listUser?.payload && <UsersTable data={listUser.payload} />}
      </div>
    </>
  )
}

export default MangeUsersPage
