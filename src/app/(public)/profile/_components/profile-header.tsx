'use client'
import { User } from '@/models'
import { useAccountContext } from '@/contexts/account'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import { Button, Chip } from '@nextui-org/react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import ChatIcon from '@/components/icons/chat-icon'
import { useCreateConversationMutation } from '@/queries/useChat'
import { toast } from 'react-toastify'

type Props = {
  data: User
}

const ProfileHeader = ({ data }: Props) => {
  const { userId } = useParams()
  const { push } = useRouter()
  const { user } = useAccountContext()
  const createConversationMutation = useCreateConversationMutation()
  const isInstructor = data.roles.some(
    (role) => role.role.name === 'ADMIN' || role.role.name === 'AUTHOR'
  )

  const createConversationHandler = async () => {
    console.log('clicked')
    try {
      const res = await createConversationMutation.mutateAsync({
        userIds: [user?.id as string, userId as string],
      })
      if (res?.payload?.id) {
        push(`/messages/p/${res?.payload?.id}`)
      }
    } catch (error) {
      toast.error('Could not send message')
    }
  }

  return (
    <>
      <div className="flex gap-4 items-center py-8">
        <Image
          src={generateMediaLink(data.avatarFileId ?? '')}
          alt={data.firstName ?? ''}
          width={160}
          height={160}
          className="object-cover rounded-full aspect-square"
        />
        <div className="space-y-4">
          <p className="text-xl font-semibold">
            {displayFullname(data.firstName, data.lastName)}
          </p>
          <div className="space-x-2">
            {data.roles.map((role) => (
              <Chip key={role.id} variant="dot" color="secondary">
                {role.role.name}
              </Chip>
            ))}
          </div>
        </div>
        {user?.email === data.email && !isInstructor && (
          <Button
            as={Link}
            href="/become-instructor"
            color="secondary"
            className="flex ml-auto items-center gap-x-2"
          >
            Become Instructor
            <ArrowRight size={18} />
          </Button>
        )}
        {user?.id !== userId && (
          <Button
            color="primary"
            className="flex ml-auto items-center gap-x-2"
            onClick={createConversationHandler}
          >
            <ChatIcon className="size-6" />
            Message
          </Button>
        )}
      </div>
    </>
  )
}

export default ProfileHeader
