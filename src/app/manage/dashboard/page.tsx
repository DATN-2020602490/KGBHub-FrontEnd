'use client'
import { Heading } from '@/components/common/heading'
import { HomeIcon } from '@/components/icons/sidebar/home-icon'
import { ReportTable } from '@/models'
import { useReportSystem } from '@/queries/useReport'
import { reportApiRequest } from '@/services/report.service'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
const RevenueChart = dynamic(
  () => import('@/app/manage/dashboard/_components/chart/revenue'),
  { ssr: false }
)

type Props = {
  searchParams: { [key: string]: string | undefined }
}

const Page = ({ searchParams }: Props) => {
  const { data, isLoading } = useReportSystem(
    'startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-04T03:20:29.444Z&groupBy=month'
  )
  console.log(data)
  const [topInstructors, setTopInstructors] = useState<ReportTable>()
  const { topInstructorsBy } = searchParams

  const getTopInstructors = async () => {
    try {
      const res = await reportApiRequest.topAuthors(
        `?groupBy=${topInstructorsBy}`
      )
      if (res.status === 200) {
        setTopInstructors(res.payload)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getTopInstructors()
  }, [])
  return (
    <>
      <Heading title="Dashboard" icon={<HomeIcon />} />
      <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 mt-8">
        <div className="flex gap-2.5 justify-center mb-10">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              Revenues
            </span>
          </div>
        </div>
        {!isLoading && <RevenueChart data={data?.payload?.systemReport} />}
      </div>
    </>
  )
}

export default Page
