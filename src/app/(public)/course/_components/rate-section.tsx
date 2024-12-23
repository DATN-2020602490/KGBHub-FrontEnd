'use client'
import FiveStars from '@/components/course/five-stars'
import RatingModal from '@/components/modals/rating-modal'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import { Rating } from '@/models'
import { useListRates } from '@/queries/useInteract'
import { Avatar, Progress } from '@nextui-org/react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function RateSection({
  myRate,
  canRate = false,
}: {
  myRate?: Rating
  canRate?: boolean
}) {
  const { courseId } = useParams()
  const { data } = useListRates({ courseId: courseId as string })
  const genaralRates = data?.option?.general
  const rates = data?.payload
  const avgRate = data?.option?.avgRate
  return (
    <div className="space-y-4">
      <p className="text-2xl font-semibold">Ratings</p>
      <div className="flex gap-8 w-full">
        <div>
          <div className="aspect-square p-8 border rounded-md space-y-1 text-center">
            <p className="text-6xl font-bold">{(avgRate ?? 0)?.toFixed(1)}</p>
            <FiveStars className="mx-auto" starRated={avgRate} />
            <p className="text-nowrap">Course Rating</p>
          </div>
          <RatingModal data={myRate} disabled={!canRate} />
        </div>
        <div className="w-full flex flex-col justify-around">
          {Object.entries(genaralRates ?? {}).map(([key, value], index) => (
            <div key={index} className="flex gap-2 items-center">
              <FiveStars starRated={Number(key)} />
              <Progress
                classNames={{
                  indicator: 'bg-yellow-400',
                }}
                value={(value / (data?.pagination?.total ?? 0)) * 100}
                className=""
              />
              <p>{`(${value})`}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 mt-8">
        {rates?.map((rate, index) => (
          <div
            key={rate.id}
            className="flex gap-x-4 p-4 rounded-xl bg-default-50 "
          >
            <Avatar
              src={generateMediaLink(rate.user.avatarFileId)}
              size="sm"
              as={Link}
              href={`/profile/${rate.user.id}`}
            />
            <div className="flex-1 space-y-2.5">
              <div className="space-y-0.5">
                <Link
                  href={`/profile/${rate.user.id}`}
                  className="font-semibold"
                >
                  {displayFullname(rate.user.firstName, rate.user.lastName)}
                </Link>
                <span className="text-xs italic ml-0.5">
                  {format(new Date(rate.createdAt), 'dd/MM/yyyy')}
                </span>
                <FiveStars starRated={rate.star} />
              </div>
              <div className="text-sm font-light">
                {rate.content ? rate.content : 'No comment.'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
