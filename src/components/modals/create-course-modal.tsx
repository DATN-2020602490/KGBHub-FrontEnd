'use client'
import { useCreateCourseMutation } from '@/queries/useCourse'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { toast } from 'react-toastify'

const CreateCourseModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const createCourseMutation = useCreateCourseMutation()
  const handleCreateCourse = async () => {
    if (createCourseMutation.isPending) return
    try {
      await createCourseMutation.mutateAsync()
      toast.success('Create a draft course successfully!')
    } catch (error) {
      toast.error('Error creating draft course')
    }
  }
  return (
    <>
      <Button color="primary" onClick={onOpen}>
        Create course
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Course
              </ModalHeader>
              <ModalBody>
                <p>
                  This means you will create a draft course and then redirect to
                  the Edit Course Page.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose()
                    handleCreateCourse()
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

export default CreateCourseModal
