'use client'
import { Course } from '@/models'
import { useAccountContext } from '@/contexts/account'
import { useCart } from '@/contexts/cart'
import { generateMediaLink } from '@/lib/utils'
import { cartApiRequest } from '@/services/cart.service'
import { coursePublicApiRequests } from '@/services/course.service'
import { Button, Divider } from '@nextui-org/react'
import { FileBadge } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useBuyCourseMutation } from '@/queries/useCourse'
import { OrderStatus } from '@/constants'

type Props = {
  data: Course
}

const CourseSidebar = ({ data }: Props) => {
  const { coursesHearted, setCoursesHearted } = useAccountContext()
  const { setCartRefresh } = useCart()
  const buyCourseMutation = useBuyCourseMutation()
  const { refresh } = useRouter()
  const { courseName, priceAmount, id, parts, thumbnailFileId } = data
  const { user } = useAccountContext()
  const isAuth = !!user?.email
  const isHearted =
    coursesHearted.length > 0
      ? coursesHearted?.some((item: any) => item.courseId === Number(id))
      : false
  const isBought = data?.coursesPaid?.some(
    (item) =>
      item.userId === user?.id && item.order.status === OrderStatus.SUCCESS
  )
  const heartCourseToggle = async () => {
    try {
      if (!isAuth) {
        toast.error('You need to login to heart course')
        return
      }
      const res = await coursePublicApiRequests.toogleHeart(id)
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
      const res = await cartApiRequest.add(id)
      if (res.status === 200) {
        toast.success('Added course to cart')
        setCartRefresh((prevState: boolean) => !prevState)
      }
    } catch (error) {}
  }

  return (
    <div className="flex-1 p-3 lg:-mt-28 ml-4 border rounded-lg bg-background h-fit space-y-2">
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
          className="w-full"
          color="secondary"
          onClick={addToCart}
          disabled={isBought}
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
      <ul>
        <li className="flex gap-1">
          <FileBadge size={18} />
          <p className="text-sm">42 lessons</p>
        </li>
      </ul>
    </div>
  )
}

export default CourseSidebar
