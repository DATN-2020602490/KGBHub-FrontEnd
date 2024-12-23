'use client'
import FiveStars from '@/components/course/five-stars'
import { CATEGORIES } from '@/lib/constants'
import { generateMediaLink } from '@/lib/utils'
import { Course } from '@/models'
import {
  useApproveCourseMutation,
  useDeleteCourseMutation,
} from '@/queries/useCourse'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Progress,
  Skeleton,
  Tooltip,
} from '@nextui-org/react'
import { Ellipsis, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type CourseType = {
  data: Course
  isAuth?: boolean
  showProcess?: boolean
}

const CourseCard = ({
  data,
  isAuth = false,
  showProcess = false,
}: CourseType) => {
  const { push, refresh } = useRouter()
  const approveCourseMutation = useApproveCourseMutation()

  const deleteCourseMutation = useDeleteCourseMutation()
  const {
    id,
    category,
    courseName,
    currency,
    hearts,
    priceAmount,
    status,
    coursesPaid,
    avgRating,
    thumbnailFileId,
    totalBought,
  } = data
  const amountBought = coursesPaid?.reduce((acc: any, current: any) => {
    const x = acc.find((item: any) => item.userId === current.userId)
    if (!x) {
      return acc.concat([current])
    } else {
      return acc
    }
  }, [])
  const categoryName = CATEGORIES.find((cat) => cat.value === category)?.name
  const deleteCourse = async () => {
    try {
      await deleteCourseMutation.mutateAsync(id)
      toast.success(`Deleted ${courseName} course successfully!`)
      refresh()
    } catch (error) {
      toast.error(`Could not delete ${courseName} course!`)
    }
  }

  const approveCourse = async () => {
    try {
      await approveCourseMutation.mutateAsync(id)
      toast.success(`Approved ${courseName} course successfully!`)
    } catch (error) {
      toast.error(`Could not approve ${courseName} course!`)
    }
  }

  return (
    <Card
      className="py-3 border border-foreground/10 rounded-md shadow-none relative"
      as={Link}
      href={isAuth ? '#' : `/course/${id}`}
      // href={isAuth ? '#' : `/course/${slug}-${id}`}
    >
      <div className="px-3 relative">
        <Image
          alt="Card background"
          className="object-cover rounded-md w-full aspect-video [div:has(>&)]:!max-w-full"
          src={
            generateMediaLink(thumbnailFileId ?? "0.jpg")
          }
          width={0}
        />

        {isAuth && (
          <Chip
            color={status === 'DRAFT' ? 'default' : 'success'}
            variant="solid"
            className="capitalize text-sm absolute top-2 right-5 z-10 rounded-md"
          >
            {status.toLowerCase()}
          </Chip>
        )}
      </div>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <div className="flex justify-between items-center w-full">
          <Chip
            variant="faded"
            className="capitalize text-xs rounded-md"
            color="warning"
            size="sm"
          >
            {categoryName ?? ''}
          </Chip>
          <p className="text-tiny uppercase font-bold text-green-500">
            {priceAmount ? `${priceAmount} ${currency}` : 'Free'}
          </p>
        </div>

        {/* <small className="text-default-500">12 Tracks</small> */}
        <h4 className="font-bold text-sm lg:text-large line-clamp-1">
          {courseName}
        </h4>

        <div className="flex justify-between items-center w-full text-sm">
          <FiveStars starRated={avgRating ?? 0} />
          <div className="flex gap-2 items-center">
            <UsersRound size={14} />
            <span>{totalBought ?? 0}</span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        {isAuth && (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="w-fit !px-0 min-w-[40px]">
                <Ellipsis />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="approve"
                className={status === 'APPROVED' ? 'hidden' : ''}
                onClick={approveCourse}
              >
                Approve
              </DropdownItem>
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem onClick={() => push(`courses/${id}`)} key="edit">
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={deleteCourse}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        {data.isBought && showProcess && (
          <Tooltip content={data.process + '%'} placement="bottom">
            <Progress
              aria-label="Loading..."
              className="w-full mt-2"
              color="success"
              // showValueLabel={true}
              size="md"
              value={data.process}
            />
          </Tooltip>
        )}
      </CardBody>
    </Card>
  )
}

export default CourseCard

export const CourseCardSkeleton = () => {
  return (
    <Card className="py-3 border border-foreground/10 rounded-md shadow-none relative">
      <div className="px-3 relative">
        <Skeleton className="object-cover rounded-md w-full aspect-video" />
      </div>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-6 w-8 rounded-md aspect-video" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
        <Skeleton className="h-7 w-fulll" />
        <div className="flex justify-between items-center w-full text-sm">
          <FiveStars starRated={0} />
          <div className="flex gap-2 items-center">
            <UsersRound size={14} />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2"></CardBody>
    </Card>
  )
}
