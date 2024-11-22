import { Conversation, Message, User } from '@/models'

export type Attachment = {
  id: string

  fileId?: string
  file?: File

  userId?: string
  user?: User

  conversationId?: string
  conversation?: Conversation

  message?: Message
  messageId?: string

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
