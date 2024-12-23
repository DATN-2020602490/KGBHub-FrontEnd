'use client'
import { Course } from '@/models'
import { useAccountContext } from '@/contexts/account'
import { formatDuration, generateMediaLink } from '@/lib/utils'
import { Button, Divider } from '@nextui-org/react'
import { Clock, FileBadge, FolderOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useBuyCourseMutation } from '@/queries/useCourse'
import {
  useAddToCartMutation,
  useMyCart,
  useRemoveToCartMutation,
} from '@/queries/useCart'
import pluralize from 'pluralize'
import { interactApiRequest } from '@/services/interact.service'

type Props = {
  data: Course
}

const CourseSidebar = ({ data }: Props) => {
  const { data: cartData } = useMyCart()
  const { coursesHearted, setCoursesHearted } = useAccountContext()
  const addToCartMutation = useAddToCartMutation()
  const removeToCartMutation = useRemoveToCartMutation()
  const buyCourseMutation = useBuyCourseMutation()
  const { refresh } = useRouter()
  const {
    courseName,
    priceAmount,
    id,
    parts,
    thumbnailFileId,
    isBought,
    isHearted,
  } = data
  const { user } = useAccountContext()
  const isAuth = !!user?.email

  // const isHearted =
  //   coursesHearted.length > 0
  //     ? coursesHearted?.some((item: any) => item.courseId === (id))
  //     : false
  // const isBought = data?.coursesPaid?.some(
  //   (item) =>
  //     item.userId === user?.id && item.order.status === OrderStatus.SUCCESS
  // )
  const totalLesson = data.totalLesson
  const isInMyCart = cartData?.payload.coursesOnCarts?.some(
    (item: any) => item.courseId === id
  )
  const heartCourseToggle = async () => {
    try {
      if (!isAuth) {
        toast.error('You need to login to heart course')
        return
      }
      const res = await interactApiRequest.heart({
        id,
        target_resource: 'course',
      })
      if (res.status === 200) {
        refresh()
      }
    } catch (error) {}
  }
  const buyCourseHandler = async () => {
    try {
      if (!isAuth) {
        toast.error('You need to login to buy course')
        return
      }
      const res = await buyCourseMutation.mutateAsync({
        courseId: id,
        successUrl: window.location.href,
      })
      if (res.status === 200) {
        if ((res.payload as { checkoutUrl: string }).checkoutUrl) {
          window.location.href = (
            res.payload as { checkoutUrl: string }
          ).checkoutUrl
        } else {
          toast.success('Buy course successfully')
          refresh()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addToCart = async () => {
    try {
      if (!isAuth) {
        toast.error('You need to login to add course to cart')
        return
      }
      const res = await addToCartMutation.mutateAsync(id)
      if (res.status === 200) {
        toast.success('Added course to cart')
      }
    } catch (error) {}
  }
  const removeToCart = async () => {
    try {
      if (!isAuth) {
        toast.error('You need to login to remove course to cart')
        return
      }
      const res = await removeToCartMutation.mutateAsync([id])
      if (res.status === 200) {
        toast.success('Added course to cart')
      }
    } catch (error) {}
  }

  return (
    <div className="flex-1 p-3 lg:-mt-28 ml-4 border rounded-lg bg-background h-fit space-y-2 lg:sticky top-24">
      <Image
        src={generateMediaLink(thumbnailFileId)}
        alt={courseName}
        width={0}
        height={0}
        sizes="1000px"
        className="w-full object-cover rounded-md"
      />
      <p className="text-xl">{'$' + priceAmount}</p>
      <Button
        className="w-full"
        color="secondary"
        variant="bordered"
        onClick={heartCourseToggle}
      >
        {isHearted ? 'Remove from favourite list' : 'Add to favourite list'}
      </Button>
      {!isBought && (
        <Button
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
          color="secondary"
          onClick={addToCart}
          disabled={isBought || isInMyCart}
        >
          Add to cart
        </Button>
      )}
      {isBought ? (
        <Button
          as={Link}
          href={
            parts && parts.length > 0
              ? `/learning/${id}?lesson=${parts[0]?.lessons[0]?.id}`
              : '#'
          }
          className="w-full"
          color="primary"
          onClick={buyCourseHandler}
        >
          Study now
        </Button>
      ) : (
        <Button className="w-full" color="primary" onClick={buyCourseHandler}>
          Buy now
        </Button>
      )}
      <Divider className="my-2" />
      <ul className="space-y-1.5">
        <li className="flex gap-1.5">
          <FileBadge size={18} />
          <p className="text-sm">
            {data.totalLesson} {pluralize('lesson', data.totalLesson)}
          </p>
        </li>
        <li className="flex gap-1">
          <FolderOpen size={18} />
          <p className="text-sm">
            {data.totalPart} {pluralize('part', data.totalPart)}
          </p>
        </li>
        <li className="flex gap-1">
          <Clock size={18} />
          <p className="text-sm">{formatDuration(data.totalDuration)}</p>
        </li>
      </ul>
    </div>
  )
}

export default CourseSidebar
