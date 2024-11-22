'use client'

import { User as UserType } from '@/models'
import DeleteUser from '@/app/manage/users/_components/delete-user'
import EditUserModal from '@/components/modals/edit-user-modal'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from '@nextui-org/react'
import { EyeIcon } from 'lucide-react'
import React from 'react'

type Props = {
  data: UserType[]
}

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'ROLES', uid: 'roles' },
  { name: 'PHONE', uid: 'phone' },
  { name: 'STATUS', uid: 'status' },
  { name: 'ACTIONS', uid: 'actions' },
]

const UsersTable = ({ data }: Props) => {
  const renderCell = React.useCallback(
    (user: UserType, columnKey: React.Key) => {
      switch (columnKey) {
        case 'name':
          return (
            <User
              avatarProps={{
                radius: 'full',
                src: generateMediaLink(user.avatarFileId ?? ''),
              }}
              description={user.email ?? user.username}
              name={displayFullname(user.firstName, user.lastName)}
            >
              {user.email}
            </User>
          )
        case 'phone':
          return <p>{user.phone}</p>
        case 'roles':
          return (
            <div className="flex gap-2">
              {user.roles.map((role) => (
                <Chip
                  key={role.roleId}
                  className="capitalize"
                  color="success"
                  size="sm"
                  variant="dot"
                >
                  {role.role.name}
                </Chip>
              ))}
            </div>
          )

        case 'status':
          return (
            <Chip
              className="capitalize"
              color="success"
              size="sm"
              variant="flat"
            >
              Active
            </Chip>
          )
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <EditUserModal user={user} />

              <DeleteUser user={user} />
            </div>
          )
        default:
          return <></>
      }
    },
    []
  )

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default UsersTable
