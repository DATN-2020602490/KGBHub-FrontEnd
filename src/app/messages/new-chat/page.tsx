'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import _ from 'lodash'
import { CheckIcon, SearchIcon } from 'lucide-react'

import { generateMediaLink } from '@/lib/utils'
import { useAccountContext } from '@/contexts/account'
import { Avatar, Button, Input } from '@nextui-org/react'
import { useSearchUserQuery } from '@/queries/useUser'
import { useCreateConversationMutation } from '@/queries/useChat'
import { toast } from 'react-toastify'

export default function Page() {
  const [search, setSearch] = useState('')
  const { user } = useAccountContext()
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const router = useRouter()

  const { data: userData } = useSearchUserQuery(search)
  const createConversationMutation = useCreateConversationMutation()

  const createConversationHandler = async () => {
    try {
      const res = await createConversationMutation.mutateAsync({
        userIds: selectedUsers.map((user) => user.id).concat(user?.id),
      })
      if (res?.payload?.id) {
        if (selectedUsers[0].id == user?.id) {
          router.push(`/messages/saved-messages`)
        } else {
          router.push(
            `/messages/${selectedUsers.length > 1 ? 'g' : 'p'}/${
              res?.payload?.id
            }`
          )
        }
      }
      setSelectedUsers([])
    } catch (error) {
      toast.error('Could not create conversation')
    }
  }
  return (
    <div className="flex h-full w-full flex-col">
      <div className="sticky top-header flex w-full shrink-0 items-center justify-between border-b border-controls-border-border-base bg-background px-4 pb-2.5 pt-4 lg:top-0 lg:px-5 lg:pt-6">
        <div className="flex items-center text-xl font-semibold">
          Select users
        </div>
        <div className="flex h-7 items-center">
          <Button size="sm" className="" onClick={createConversationHandler}>
            Continue
          </Button>
        </div>
      </div>
      <div className="flex-1 px-4 py-3 lg:px-5">
        <Input
          startContent={<SearchIcon />}
          isClearable
          className="w-full"
          classNames={{
            input: 'w-full',
            mainWrapper: 'w-full',
          }}
          onChange={_.debounce((e) => setSearch(e.target.value), 500)}
          onClear={() => setSearch('')}
          placeholder="Search names or user ID"
        />

        <div className="mt-5 flex w-full flex-col gap-2">
          {selectedUsers?.map((user) => (
            <div
              key={user.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-controls-border-border-base px-3.5 py-2 hover:bg-background-background-mid"
              onClick={() =>
                setSelectedUsers((prev) =>
                  prev.some((selectUser) => user.id == selectUser.id)
                    ? prev.filter((selectUser) => user.id != selectUser.id)
                    : [...prev, user]
                )
              }
            >
              <Avatar
                src={generateMediaLink(user.avatar)}
                className="h-9 w-9 shrink-0 border-none lg:h-11 lg:w-11"
              ></Avatar>
              <div className="w-full">
                <div className="text-sm lg:text-base">{`${
                  user.firstName || ''
                } ${user.lastName || ''}`}</div>
                <div className="h-3 text-xs font-medium leading-3 lg:h-5 lg:text-xs lg:leading-5">
                  {user.username || ''}
                </div>
              </div>
              <div className="grid h-fit place-items-center rounded-full border border-controls-border-border-base p-1">
                {selectedUsers.some(
                  (selectUser) => user.id == selectUser.id
                ) ? (
                  <div className="grid aspect-square h-4 place-items-center rounded-full bg-[#84CC16] lg:h-[22px]">
                    <CheckIcon className="h-3 w-3 text-white lg:h-4 lg:w-4" />
                  </div>
                ) : (
                  <div className="aspect-square h-4 lg:h-[22px]"></div>
                )}
              </div>
            </div>
          ))}
          {userData?.payload
            ?.filter((user) => !selectedUsers.some((u) => u.id == user.id))
            ?.map((user) => (
              <div
                key={user.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-controls-border-border-base px-3.5 py-2 hover:bg-background-background-mid"
                onClick={() =>
                  setSelectedUsers((prev) =>
                    prev.some((selectUser) => user.id == selectUser.id)
                      ? prev.filter((selectUser) => user.id != selectUser.id)
                      : [...prev, user]
                  )
                }
              >
                <Avatar
                  src={generateMediaLink(user.avatarFileId)}
                  className="h-9 w-9 shrink-0 border-none lg:h-11 lg:w-11"
                ></Avatar>
                <div className="w-full">
                  <div className="text-sm lg:text-base">{`${
                    user.firstName || ''
                  } ${user.lastName || ''}`}</div>
                  <div className="h-3 text-xs font-medium leading-3 lg:h-5 lg:text-xs lg:leading-5">
                    {user.username || ''}
                  </div>
                </div>
                <div className="grid h-fit place-items-center rounded-full border border-controls-border-border-base p-1">
                  {selectedUsers.some(
                    (selectUser) => user.id == selectUser.id
                  ) ? (
                    <div className="grid aspect-square h-4 place-items-center rounded-full bg-[#84CC16] lg:h-[22px]">
                      <CheckIcon className="h-3 w-3 text-white lg:h-4 lg:w-4" />
                    </div>
                  ) : (
                    <div className="aspect-square h-4 lg:h-[22px]"></div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
