'use client'

import { DeleteIcon } from '@/components/icons/table/delete-icon'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react'

const DeleteCampaignModal = ({ onDelete }: { onDelete: () => void }) => {
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
              <ModalHeader className="flex flex-col gap-1">
                Are you absolutely sure?
              </ModalHeader>
              <ModalBody>
                This action cannot be undone. This will permanently delete this
                campaign from our servers.
              </ModalBody>
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
export default DeleteCampaignModal
