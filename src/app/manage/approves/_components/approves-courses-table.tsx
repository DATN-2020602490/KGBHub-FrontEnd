'use client'

import CourseForm from '@/components/course/course-form'
import { generateMediaLink } from '@/lib/utils'
import { CourseStatus } from '@/constants'
import {
  useApproveCourseMutation,
  useListCourseManager,
} from '@/queries/useCourse'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'
import { Check, EyeIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'
const LIMIT = 12

const ApprovesCoursesTable = () => {
  const [offset, setOffset] = useState(0)
  const approveCourseMutation = useApproveCourseMutation()
  const { data, isLoading } = useListCourseManager(
    `limit=${LIMIT}&offset=${offset}&status=${CourseStatus.DRAFT}`
  )
  const approveCourse = async (courseId: string) => {
    try {
      const res = await approveCourseMutation.mutateAsync(courseId)
      toast.success('Course approved successfully')
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  return (
    <Table aria-label="Example empty table" className="w-full">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>REQUEST AT</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No pending request'}>
        {(data?.payload || []).map((course: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-2 w-fit">
                <Image
                  src={generateMediaLink(course.thumbnail ?? '0.jpg')}
                  alt={course.courseName}
                  width={400}
                  height={400}
                  className="object-cover w-14"
                />
                <span className="line-clamp-2">{course.courseName}</span>
              </div>
            </TableCell>
            <TableCell>{course.category}</TableCell>
            <TableCell>
              {/* {formatDate(new Date(course.timestamp), 'MM/dd/yyyy')} */}
              date
            </TableCell>
            <TableCell className="">
              <div className="flex gap-2 items-center">
                <CoursePreview data={course} />
                <Tooltip content="Approve">
                  <span
                    className="text-lg text-success-400 cursor-pointer active:opacity-50"
                    onClick={() => approveCourse(course.id)}
                  >
                    <Check />
                  </span>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ApprovesCoursesTable

const CoursePreview = ({ data }: { data: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Tooltip content="Details">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-screen-md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">Rating course</ModalHeader>
              <ModalBody>
                <CourseForm defaultValues={data} isReadOnly />
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
