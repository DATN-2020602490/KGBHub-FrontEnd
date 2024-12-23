import { CHAT_MEMBER_ROLE } from '@/constants'
import http from '@/lib/http'
import { Conversation, Message } from '@/models'

const chatApiRequest = {
  getList: () =>
    http.get<
      {
        conversation: Conversation
        lastMessage: { content: string; chatMembersOnMessages: any[] } | null
      }[]
    >('/chats'),
  get: (conversationId: string, params: string) =>
    http.get<Message[], { chat: Conversation }>(
      `/chats/${conversationId}?${params}`
    ),
  getMessage: (messageId: string) => http.get(`/chats/message/${messageId}`),
  getMyAttachments: (attachmentId: string) =>
    http.get(`/chats/attachments/my-files?attachmentId=${attachmentId}`),
  getAttachmentsShared: (attachmentId: string) =>
    http.get(`/chats/attachments/shared-files?attachmentId=${attachmentId}`),

  cretae: (body: { userIds: string[] }) =>
    http.post<Conversation>('/chats', body),
  acceptConversation: (body: { conversationId: string }) =>
    http.post('/chats/actions/accept', body),
  uploadAttachment: (body: FormData) =>
    http.post('/chats/actions/upload-attachments', body),
  joinConversation: (body: { conversationId: string }) =>
    http.post('/chats/actions/join', body),
  leaveConversation: (body: { conversationId: string }) =>
    http.post('/chats/actions/leave', body),
  removeMember: (body: { conversationId: string; userId: string }) =>
    http.post('/chats/actions/remove', body),
  addMember: (body: {
    conversationId: string
    users: {
      username: string
      chatMemberRole: (typeof CHAT_MEMBER_ROLE)[keyof typeof CHAT_MEMBER_ROLE]
    }
  }) => http.post('/chats/actions/add-members', body),
  toggleMute: (body: { conversationId: string }) =>
    http.post('/chats/actions/mute', body),

  edit: (
    conversationId: string,
    body: { converstationName: string; avatar: string }
  ) => http.patch(`/chats/${conversationId}`, body),
}

export default chatApiRequest
