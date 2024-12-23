'use client'
import slugify from 'slugify'
import { useState } from 'react'
import _ from 'lodash'
import { CalendarDays, SearchIcon, X } from 'lucide-react'

import { displayFullname, generateMediaLink } from '@/lib/utils'
import { useAccountContext } from '@/contexts/account'
import { Avatar, Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useSearchAuthorQuery } from '@/queries/useUser'
import { User } from '@/models'
import { useReportAuthor } from '@/queries/useReport'
import DatePicker from 'react-date-picker'
import ChartSkeleton from '@/app/manage/dashboard/_components/chart-skeleton'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { RoleEnum } from '@/constants'

const AuthorChart = dynamic(
  () => import('@/app/manage/dashboard/_components/chart/author-chart'),
  { ssr: false }
)

export default function AuthorTab() {
  const [search, setSearch] = useState('')
  const { user } = useAccountContext()
  const isAdmin = user?.roles.some((role) => role.role.name === RoleEnum.ADMIN)

  const [selectedAuthor, setSelectedAuthor] = useState<User>()
  const { data: authData } = useSearchAuthorQuery(search)

  const [groupBy, setGroupBy] = useState('month')
  const [startDate, setStartDate] = useState<any>(
    new Date('2024-01-01T00:00:00.000Z')
  )
  const [endDate, setEndDate] = useState<any>(new Date())
  const { data, isLoading } = useReportAuthor(
    `startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}${
      selectedAuthor?.id ? `&authorId=${selectedAuthor.id}` : ''
    }`
  )

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 px-4 py-3 lg:px-5">
        {isAdmin && !selectedAuthor && (
          <Input
            startContent={<SearchIcon />}
            isClearable
            className="w-full"
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            onChange={_.debounce((e) => setSearch(e.target.value), 500)}
            placeholder="Search names or user ID"
            onClear={() => setSearch('')}
          />
        )}

        {authData && (
          <div className="mt-5 flex w-full flex-col gap-2">
            {user &&
              authData?.payload?.map((user) => (
                <div
                  key={user.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-controls-border-border-base px-3.5 py-2 hover:bg-background-background-mid"
                  onClick={() => {
                    setSelectedAuthor(user)
                    setSearch('')
                  }}
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
                </div>
              ))}
          </div>
        )}

        {selectedAuthor ? (
          <div className="w-[320px] items-center relative flex justify-between bg-default-100 rounded-md p-6 mx-auto mb-6">
            <span
              className="absolute top-1.5 right-1.5 cursor-pointer"
              onClick={() => setSelectedAuthor(undefined)}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                height="1em"
                role="presentation"
                viewBox="0 0 24 24"
                width="1em"
              >
                <path
                  d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={
                  generateMediaLink(selectedAuthor.avatarFileId) ??
                  'https://nextui.org/avatars/avatar-1.png'
                }
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {displayFullname(user?.firstName, user?.lastName)}
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  @
                  {user?.username ??
                    slugify(displayFullname(user?.firstName, user?.lastName))}
                </h5>
              </div>
            </div>
            <Button
              as={Link}
              href={`/profile/${selectedAuthor.id}`}
              color="primary"
              radius="full"
              size="sm"
            >
              View profile
            </Button>
          </div>
        ) : (
          isAdmin && (
            <div className="grid w-full place-items-center bg-background-background-high h-[60vh]">
              <div className="rounded-full bg-default-100 py-2.5 px-6 text-lg font-medium text-text-foreground-low">
                Select the author you want to view revenue for
              </div>
            </div>
          )
        )}
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          ((isAdmin && selectedAuthor) || !isAdmin) && (
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
              <div className="flex gap-2.5 justify-center mb-4">
                <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
                  <span className="text-default-900 text-xl font-semibold">
                    Revenues
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 px-44 relative">
                <Select
                  defaultSelectedKeys={['month']}
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="max-w-xs"
                  radius="sm"
                  label="Group by"
                  placeholder="Group by"
                  labelPlacement="outside"
                >
                  <SelectItem key="month" value="month">
                    Month
                  </SelectItem>
                  <SelectItem key="year" value="year">
                    Year
                  </SelectItem>
                </Select>
                <div className="space-y-2">
                  <span className="relative text-foreground text-sm">
                    Start date
                  </span>
                  <DatePicker
                    className="w-full !h-10"
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    onChange={(date) => setStartDate(date)}
                    value={startDate}
                    calendarIcon={!startDate ? <CalendarDays /> : null}
                    clearIcon={startDate ? <X /> : null}
                  />
                </div>
                <div className="space-y-2">
                  <span className="relative text-foreground text-sm">
                    End date
                  </span>
                  <DatePicker
                    className="w-full !h-10"
                    dayPlaceholder="dd"
                    monthPlaceholder="mm"
                    yearPlaceholder="yyyy"
                    onChange={(date) => setEndDate(date)}
                    value={endDate}
                    calendarIcon={!endDate ? <CalendarDays /> : null}
                    clearIcon={endDate ? <X /> : null}
                  />
                </div>
              </div>
              <AuthorChart
                groupBy={groupBy}
                data={data?.payload?.authorReport}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}
