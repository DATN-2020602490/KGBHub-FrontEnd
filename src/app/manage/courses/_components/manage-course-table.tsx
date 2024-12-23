'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Selection,
  ChipProps,
  SortDescriptor,
  Image,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react'
import { generateMediaLink } from '@/lib/utils'
import { Course } from '@/models'
import { CourseStatus } from '@/constants'
import { EyeIcon } from '@/components/icons/table/eye-icon'
import { EditIcon } from '@/components/icons/table/edit-icon'
import { DeleteIcon } from '@/components/icons/table/delete-icon'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  useApproveCourseMutation,
  useDeleteCourseMutation,
} from '@/queries/useCourse'
import { toast } from 'react-toastify'

const statusColorMap: Record<string, ChipProps['color']> = {
  [CourseStatus.APPROVED]: 'success',
  [CourseStatus.PENDING]: 'warning',
  [CourseStatus.DRAFT]: 'default',
}

const INITIAL_VISIBLE_COLUMNS = [
  'courseName',
  'category',
  'students',
  'status',
  'actions',
]

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'courseName', sortable: true },
  { name: 'AGE', uid: 'age', sortable: true },
  { name: 'CATEGORY', uid: 'category', sortable: true },
  { name: 'STUDENTS', uid: 'students', sortable: true },
  { name: 'TEAM', uid: 'team' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
]

const statusOptions = [
  { name: CourseStatus.APPROVED, uid: 'approved' },
  { name: CourseStatus.DRAFT, uid: 'draft' },
  { name: CourseStatus.PENDING, uid: 'pending' },
]

export default function ManageCourseTable({ data }: { data: any }) {
  const { push } = useRouter()
  const approveCourseMutation = useApproveCourseMutation()
  const deleteCourseMutation = useDeleteCourseMutation()
  const [filterValue, setFilterValue] = React.useState('')
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'age',
    direction: 'ascending',
  })

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...data]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      )
    }

    return filteredUsers
  }, [data, filterValue, statusFilter])

  const deleteCourse = async (data: Course) => {
    try {
      await deleteCourseMutation.mutateAsync(data.id)
      toast.success(`Deleted ${data.courseName} course successfully!`)
    } catch (error) {
      toast.error(`Could not delete ${data.courseName} course!`)
    }
  }

  const approveCourse = async (data: Course) => {
    try {
      await approveCourseMutation.mutateAsync(data.id)
      toast.success(`Approved ${data.courseName} course successfully!`)
    } catch (error) {
      toast.error(`Could not approve ${data.courseName} course!`)
    }
  }

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Course, b: Course) => {
      const first = a[sortDescriptor.column as keyof Course] as number
      const second = b[sortDescriptor.column as keyof Course] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, filteredItems])

  const renderCell: any = React.useCallback(
    (course: Course, columnKey: React.Key) => {
      const cellValue = course[columnKey as keyof Course]

      switch (columnKey) {
        case 'courseName':
          return (
            <div className="flex gap-2">
              <Image
                fallbackSrc="/images/upload-image-default.png"
                src={generateMediaLink(course.thumbnailFileId)}
                alt={course.courseName}
                width={80}
                height={45}
                radius="sm"
                className="object-cover aspect-video w-full !bg-cover !bg-center !bg-no-repeat shrink-0"
              />
              <span>{course.courseName}</span>
            </div>
          )
        case 'category':
          return (
            <Chip
              variant="faded"
              className="capitalize text-xs rounded-md"
              color="warning"
              size="sm"
            >
              {course.category ?? ''}
            </Chip>
          )
        case 'students':
          return <span>{course.totalBought ?? 0}</span>
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[course.status]}
              size="sm"
              variant="dot"
            >
              {cellValue + ''}
            </Chip>
          )
        case 'actions':
          return (
            <div className="relative flex items-center gap-x-4">
              {course.status === CourseStatus.APPROVED ? (
                <Tooltip content="View">
                  <span
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => push(`/course/${course.id}`)}
                  >
                    <EyeIcon className="text-primary" />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip color="success" content="Approve">
                  <span
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => approveCourse(course)}
                  >
                    <Check size="1em" className="text-success" />
                  </span>
                </Tooltip>
              )}
              <Tooltip content="Edit">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => push(`/manage/courses/${course.id}`)}
                >
                  <EditIcon className="text-warning" />
                </span>
              </Tooltip>
              <DeleteCourseModal onDelete={() => deleteCourse(course)} />
            </div>
          )
        default:
          return cellValue
      }
    },
    []
  )

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
      className="mt-8"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No courses found'} items={sortedItems}>
        {(item: any) => (
          <TableRow key={item.id}>
            {(columnKey: any) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

const DeleteCourseModal = ({ onDelete }: { onDelete: () => void }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Tooltip
        color="danger"
        content="Delete"
        className="select-none"
        onClick={(e) => e.preventDefault()}
      >
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={() => {
            onOpen()
            console.log('clicked')
          }}
        >
          <DeleteIcon />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>Hello</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onDelete()
                    onClose()
                  }}
                >
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
