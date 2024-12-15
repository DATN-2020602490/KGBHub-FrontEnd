import { Attachment, Course, Heart, User } from '@/models'

export const ChatMemberRole = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const
export type ChatMemberRole =
  (typeof ChatMemberRole)[keyof typeof ChatMemberRole]

export const MessageType = {
  DEFAULT: 'DEFAULT',
  CALL: 'CALL',
} as const
export type MessageType = (typeof MessageType)[keyof typeof MessageType]

export const MemberStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  ARCHIVED: 'ARCHIVED',
  REMOVED: 'REMOVED',
} as const
export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus]

export const UserView = {
  SENDER: 'SENDER',
  RECEIVER: 'RECEIVER',
} as const
export type UserView = (typeof UserView)[keyof typeof UserView]

export const ConversationType = {
  CLOUD_SAVE: 'CLOUD_SAVE',
  DM: 'DM',
  COURSE_GROUP_CHAT: 'COURSE_GROUP_CHAT',
  GROUP_CHAT: 'GROUP_CHAT',
} as const

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType]

export type Conversation = {
  id: string

  messages: Message[]

  avatarFileId?: string
  avatar?: string

  roomId: string

  conversationName?: string

  conversationType: ConversationType

  chatMembers: ChatMember[]

  course?: Course
  courseId?: string

  attachments: Attachment[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  unreadMessages?: number
}

export type ChatMember = {
  id: string

  user: User
  userId: string

  conversation: Conversation
  conversationId: string

  chatMemberRole: ChatMemberRole
  chatMembersOnMessages: ChatMembersOnMessages[]

  isMute: boolean

  status: MemberStatus

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type Message = {
  id: string

  content: string
  type: MessageType

  attachments: Attachment[]

  conversation: Conversation
  conversationId: string

  recalled: boolean

  targetMessageId?: string

  targetMessage?: Message
  replyMessages: Message[]

  hearts: Heart[]

  chatMembersOnMessages: ChatMembersOnMessages[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type ChatMembersOnMessages = {
  id: string
  chatMember: ChatMember
  chatMemberId: string

  message: Message
  messageId: string

  userView: UserView

  forceRead: boolean
  read: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
