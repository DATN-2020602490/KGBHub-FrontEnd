'use client'
import TextLessonForm from '@/components/lesson/text-lesson-form'
import VideoLessonForm from '@/components/lesson/video-lesson-form'
import { convertObjectToFormData } from '@/lib/utils'
import { Part } from '@/models'
import { useCreateLessonMutation } from '@/queries/useLesson'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react'
import { PlusCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  data: Part
}

const CreateLessonModal = ({ data }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [lessonType, setLessonType] = React.useState('video')
  const createLessonMutation = useCreateLessonMutation()
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLessonType(e.target.value)
  }
  const defaultData = {
    lessonType: lessonType.toUpperCase(),
    courseId: data.courseId,
    partId: data.id,
    lessonNumber: data.lessons.length + 1,
  }
  const createLessonText = async (values: any) => {
    try {
      const body = { ...defaultData, ...values }

      const res = await createLessonMutation.mutateAsync(body)
      toast.success('Lesson created successfully')
      onClose()
    } catch (error) {}
  }
  const createLessonVideo = async (values: any) => {
    try {
      const formData = convertObjectToFormData({ ...defaultData, ...values })

      const res = await createLessonMutation.mutateAsync(formData)
      toast.success('Lesson created successfully')
      onClose()
    } catch (error) {}
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-screen-xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Lesson number {data.lessons.length + 1}
              </ModalHeader>
              <ModalBody>
                <Select
                  isRequired
                  labelPlacement="outside"
                  label="Lesson type"
                  placeholder="Select an lesson type"
                  defaultSelectedKeys={['video']}
                  className="max-w-xs"
                  onChange={handleSelectionChange}
                >
                  <SelectItem key="video" value="video">
                    Video
                  </SelectItem>
                  <SelectItem key="text" value="text">
                    Document
                  </SelectItem>
                </Select>
                {lessonType === 'video' ? (
                  <VideoLessonForm data={data} onSubmit={createLessonVideo} />
                ) : (
                  <TextLessonForm data={data} onSubmit={createLessonText} />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        onClick={onOpen}
        className="mx-auto my-2 flex items-center gap-x-2"
        size="md"
        color="secondary"
        variant="bordered"
      >
        <PlusCircle />
        Add new lesson
      </Button>
    </>
  )
}

export default CreateLessonModal
