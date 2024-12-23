import React from 'react';
import { SubmitForm } from '@/app/globals';
import { displayFullname, generateMediaLink } from '@/lib/utils';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { EyeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  data: SubmitForm
}

const ActionRequestModal = ({ data }: Props) => {
  const { refresh } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    selfieFileId,
    real_firstName,
    real_lastName,
    backIdCardFileId,
    frontIdCardFileId,
    updatedAt,
    category,
    linkCV,
  } = data;

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col border-b">
                <h2 className="text-xl font-semibold">Request Details</h2>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(updatedAt).toLocaleDateString()}
                </p>
              </ModalHeader>
              
              <ModalBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      <div className="flex items-center gap-4">
                        <Image
                          src={generateMediaLink(selfieFileId ?? '')}
                          alt="Profile"
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                        <div className="space-y-2">
                          <p className="text-lg font-medium">
                            {displayFullname(real_firstName, real_lastName)}
                          </p>
                          <span className="px-3 py-1 bg-primary-100 text-primary rounded-full text-sm">
                            {category}
                          </span>
                          <Button 
                            as={Link} 
                            href={linkCV}
                            className="w-full mt-2"
                            color="primary"
                            variant="flat"
                          >
                            View CV
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ID Card Section */}
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-4">ID Card Images</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Front Side</p>
                          <Image
                            src={generateMediaLink(frontIdCardFileId ?? '')}
                            alt="ID Front"
                            width={400}
                            height={250}
                            className="w-full rounded-lg object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Back Side</p>
                          <Image
                            src={generateMediaLink(backIdCardFileId ?? '')}
                            alt="ID Back"
                            width={400}
                            height={250}
                            className="w-full rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t">
                <Button color="danger" variant="light" onPress={onClose} className="mr-2">
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Tooltip content="View Details">
        <span
          className="cursor-pointer hover:opacity-70 active:opacity-50"
          onClick={onOpen}
        >
          <EyeIcon className="w-5 h-5" />
        </span>
      </Tooltip>
    </>
  );
};

export default ActionRequestModal;