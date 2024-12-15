'use client'
import { Heading } from '@/components/common/heading'
import { generateMediaLink } from '@/lib/utils'
import { useMyPromotions } from '@/queries/useCampaigns'
import { useMyCart } from '@/queries/useCart'
import { cartApiRequest } from '@/services/cart.service'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CartCheckoutPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]))
  const [promotionSelected, setPromotionSelected] = useState<string>('')

  const { data: cartData } = useMyCart()
  const totalPrice =
    selectedKeys === 'all'
      ? cartData?.payload?.coursesOnCarts?.reduce(
          (acc: number, course: any) => acc + course.course.priceAmount,
          0
        )
      : cartData?.payload?.coursesOnCarts
          ?.filter((item: any) => [...selectedKeys]?.includes(item.courseId))
          ?.reduce(
            (acc: number, course: any) => acc + course.course.priceAmount,
            0
          )
  const removeItem = async (courseIds: string[]) => {
    try {
      const res = await cartApiRequest.remove(courseIds)
    } catch (error) {
      console.log(error)
    }
  }
  const checkoutCart = async () => {
    try {
      setIsLoading(true)
      const data =
        selectedKeys === 'all'
          ? cartData?.payload?.coursesOnCarts?.map((course) => course.courseId)
          : [...selectedKeys]
      const res = await cartApiRequest.checkout(data as string[])
      if (res.status === 200) {
        if ((res.payload as { url: string }).url) {
          window.location.href = (res.payload as { url: string }).url
        } else {
          toast.success('Buy course successfully')
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }
  if (!cartData) return
  const rows = cartData?.payload?.coursesOnCarts?.map((course: any) => ({
    key: course.coureseId,
    name: (
      <Link
        href={'/course/' + course.courseId}
        className="flex items-center gap-2 w-fit"
      >
        <Image
          src={generateMediaLink(course.course.thumbnail ?? '')}
          alt={course.course.courseName}
          width={400}
          height={400}
          className="object-cover w-14"
        />
        <span className="line-clamp-2">{course.course.courseName}</span>
      </Link>
    ),
    price: '$' + course.course.priceAmount,
    action: <Button size="sm" color="danger"></Button>,
  }))
  // let list = useAsyncList({
  //   async load({ signal }) {
  //     return {
  //       items: cart.coursesOnCarts,
  //     }
  //   },
  //   async sort({ items, sortDescriptor }) {
  //     return {
  //       items: items.sort((a:any, b:any) => {
  //         let first = a[sortDescriptor.column]
  //         let second = b[sortDescriptor.column]
  //         let cmp =
  //           (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

  //         if (sortDescriptor.direction === 'descending') {
  //           cmp *= -1
  //         }

  //         return cmp
  //       }),
  //     }
  //   },
  // })
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Heading title="My cart" />
        <Table
          // sortDescriptor={list.sortDescriptor}
          color={'primary'}
          selectionMode="multiple"
          defaultSelectedKeys={['2', '3']}
          aria-label="Example static collection table"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader>
            <TableColumn key="courseName">COURSE</TableColumn>
            <TableColumn key="priceAmount">PRICE</TableColumn>
            <TableColumn key="cartAction">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {cartData?.payload?.coursesOnCarts?.length > 0 ? (
              cartData?.payload.coursesOnCarts.map((course: any) => (
                <TableRow key={course.courseId}>
                  <TableCell className="">
                    <Link
                      href={'/course/' + course.courseId}
                      className="flex items-center gap-2 w-fit"
                    >
                      <Image
                        src={generateMediaLink(
                          course.course.thumbnailFileId ?? ''
                        )}
                        alt={course.course.courseName}
                        width={400}
                        height={400}
                        className="object-cover w-14"
                      />
                      <span className="line-clamp-2">
                        {course.course.courseName}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>{'$' + course.course.priceAmount}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => removeItem([course.courseId])}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </div>
      <PromotionSelectorModal
        promotionSelected={promotionSelected}
        setPromotionSelected={setPromotionSelected}
      />
      <div className="w-fit ml-auto flex gap-2 items-center">
        <div>
          <span>{`Total: $${totalPrice}`}</span>
        </div>
        <Button color="primary" onClick={checkoutCart}>
          Pay now
        </Button>
      </div>
    </div>
  )
}

export default CartCheckoutPage

const PromotionSelectorModal = ({
  promotionSelected,
  setPromotionSelected,
}: {
  promotionSelected: string
  setPromotionSelected: (value: string) => void
}) => {
  const { data } = useMyPromotions()
  const myPromotions = data?.payload
  console.log(myPromotions)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  return (
    <div className="flex flex-col gap-2">
      <Button onPress={onOpen} className="max-w-fit">
        Open Modal
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <RadioGroup
                  label="Select promotion"
                  orientation="horizontal"
                  value={promotionSelected}
                  onValueChange={setPromotionSelected}
                >
                  <Radio value="auto">auto</Radio>
                  <Radio value="top">top</Radio>
                  <Radio value="bottom">bottom</Radio>
                  <Radio value="center">center</Radio>
                  <Radio value="top-center">top-center</Radio>
                  <Radio value="bottom-center">bottom-center</Radio>
                </RadioGroup>
                <div className="space-y-2.5">
                  {myPromotions?.map((promotion) => (
                    <div
                      key={promotion.id}
                      className={`p-4 rounded-md border cursor-pointer flex gap-x-4`}
                    >
                      <Image
                        src={generateMediaLink(
                          promotion.campaign.coverFileId ?? ''
                        )}
                        alt={promotion.campaign.name}
                        width={200}
                        height={200}
                        className="object-cover aspect-video w-32"
                      />
                      <div>
                        <p className="text-semibold">
                          {promotion.campaign.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
