'use client'

import ChartSkeleton from '@/app/manage/dashboard/_components/chart-skeleton'

import { useReportSystem } from '@/queries/useReport'
import { Select, SelectItem } from '@nextui-org/react'
import { CalendarDays, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import DatePicker from 'react-date-picker'

const RevenueChart = dynamic(
  () => import('@/app/manage/dashboard/_components/chart/revenue'),
  { ssr: false }
)

export default function SystemTab() {
  const [groupBy, setGroupBy] = useState('month')
  const [startDate, setStartDate] = useState<any>(
    new Date('2024-01-01T00:00:00.000Z')
  )
  const [endDate, setEndDate] = useState<any>(new Date())
  const { data, isLoading } = useReportSystem(
    `startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`
  )
  return (
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
          <span className="relative text-foreground text-sm">Start date</span>
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
          <span className="relative text-foreground text-sm">End date</span>
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
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <RevenueChart groupBy={groupBy} data={data?.payload?.systemReport} />
      )}
    </div>
  )
}
