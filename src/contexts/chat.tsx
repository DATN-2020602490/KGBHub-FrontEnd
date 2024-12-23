'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { useAccountContext } from '@/contexts/account'
import { CONVERSATION_TYPE } from '@/constants'
import { toast } from 'react-toastify'
import chatApiRequest from '@/services/chat.service'

interface IContext {
  inboxes: any[]
  setInboxes: (inboxes: any[]) => void
  messages: {
    [id: string]: any[]
  }
  messageTemplates: string[]
  setMessageTemplates: any
  chatList: undefined | any[]
  fetchMessages: (_firstTime?: boolean) => Promise<void>
  remaining: boolean
  sendMessage: any
  conversation: any
  targetMessageId: string | null
  setTargetMessageId: (_id: string | null) => void
  toggleShowInbox: (_conversation: any) => void
}
const defaultData: IContext = {
  inboxes: [],
  setInboxes: () => {},
  messages: {},
  chatList: undefined,
  messageTemplates: [],
  setMessageTemplates: () => {},
  fetchMessages: async (_firstTime?: boolean) => {},
  remaining: true,
  sendMessage: async () => {},
  conversation: {},
  targetMessageId: null,
  setTargetMessageId: (_id: string | null) => {},
  toggleShowInbox: () => {},
}
export const ChatContext = createContext<IContext>(defaultData)
function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAccountContext()
  const isLoggedIn = !!user?.email
  const router = useRouter()
  const socket = useRef<Socket>()
  const { conversationId: conversationIdParam }: { conversationId: string } =
    useParams()
  const pathname = usePathname()
  const [messages, setMessages] = useState<{
    [id: string]: any[]
  }>({})
  const [remaining, setRemaining] = useState<boolean>(true)
  const [conversation, setConversation] = useState<any>()
  const [conversationId, setConversationId] = useState<any>()
  const [socketLoggedIn, setSocketLoggedIn] = useState(false)
  const [chatList, setChatList] = useState<undefined | any[]>(undefined)
  const [targetMessageId, setTargetMessageId] = useState<string | null>(null)
  const isSavedMessageRoute = pathname.includes('messages/saved')
  const [messageTemplates, setMessageTemplates] = useState<string[]>([])
  const [inboxes, setInboxes] = useState<any[]>([])

  useEffect(() => {
    if (chatList) {
      if (isSavedMessageRoute) {
        const conversationId = chatList.find(
          (chat) =>
            chat.conversation.conversationType == CONVERSATION_TYPE.CLOUD_SAVE
        )?.conversation?.id
        if (!conversationId) {
          router.replace('/chat')
          return
        }
        setConversationId(conversationId)
      } else {
        setConversationId(conversationIdParam)
      }
    }
  }, [isSavedMessageRoute, chatList, conversationIdParam])
  useEffect(() => {
    if (isLoggedIn && !socket.current) {
      socket.current = io(
        `${process.env.NEXT_PUBLIC_API_BASE?.replaceAll('api/v1', 'chats')}`,
        {
          transports: ['websocket'],
        }
      )
      socket.current.emit('login', {
        accessToken: localStorage.getItem('accessToken'),
      })
      socket.current.on('login', () => {
        setSocketLoggedIn(true)
      })
      socket.current.on('getChats', (data) => {
        setChatList(data)
      })
      socket.current.on('newMessage', (data) => {
        setMessages((prevState) => {
          const newState = { ...prevState }
          if (newState[data.conversationId]) {
            newState[data.conversationId] = [
              data,
              ...newState[data.conversationId],
            ]
          } else {
            newState[data.conversationId] = [data]
            if (Object.keys(newState).length > 5) {
              delete newState[Object.keys(newState).at(-1) as string]
            }
          }
          return newState
        })
      })
    } else {
      if (!isLoggedIn) {
        setSocketLoggedIn(false)
        setChatList(undefined)
        socket.current?.disconnect()
        socket.current = undefined
        outRoom()
      }
    }
  }, [isLoggedIn])

  const toggleShowInbox = (conversation: any) => {
    const condition = inboxes.some(
      (inbox) => inbox.conversation.id === conversation.id
    )
    if (condition) {
      setInboxes(
        inboxes.filter((inbox) => inbox.conversation.id !== conversation.id)
      )
    } else {
      if (inboxes.length < 5) {
        setInboxes([...inboxes, conversation])
      }
    }
  }

  const fetchMessages = async (firstTime?: boolean) => {
    try {
      const offset = firstTime
        ? messages[conversationId as string]?.length > 39
          ? messages[conversationId as string]?.length - 40
          : 0
        : messages[conversationId as string]?.length || 0
      const res = await chatApiRequest.get(
        conversationId,
        `offset=${offset}&limit=40`
      )
      if (res.status === 200) {
        if (
          (firstTime && !messages[conversationId as string]?.length) ||
          !firstTime
        ) {
          const data = res?.payload || []
          const id = res?.option?.chat.id
          setMessages((prevState) => {
            const newState = { ...prevState }
            if (newState[id]) {
              newState[id] = newState[id].concat(data)
            } else {
              newState[id] = data
              if (Object.keys(newState).length > 5) {
                delete newState[Object.keys(newState).at(-1) as string]
              }
            }
            return newState
          })
        }
        setRemaining(res?.pagination?.page < res?.pagination?.totalPages)
      }
    } catch (error) {
      toast.error('Could not fetch messages')
    }
  }

  useEffect(() => {
    if (socketLoggedIn) {
      outRoom()
      if (conversationId) {
        fetchMessages(true)
      }
    }
  }, [conversationId, socketLoggedIn])
  useEffect(() => {
    if (socketLoggedIn) {
      if (conversationId && chatList) {
        const data = chatList.find(
          (chat) => chat?.conversation?.id == conversationId
        )
        setConversation(data.conversation)
      }
    }
  }, [conversationId, socketLoggedIn, chatList])

  useEffect(() => {
    if (conversation?.roomId) {
      joinRoom()
    }
  }, [conversation?.roomId])

  const joinRoom = async () => {
    try {
      if (isLoggedIn) {
        socket.current?.emit('joinRoom', {
          id: conversation?.roomId,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const outRoom = async () => {
    try {
      if (conversation?.roomId) {
        socket.current?.emit('outRoom', {
          id: conversation?.roomId,
        })
      }
      setMessages((prevState) => {
        const newState = { ...prevState }
        delete newState[conversation?.roomId]
        return newState
      })
      setConversation(undefined)
      setRemaining(true)
    } catch (error) {
      console.error(error)
    }
  }
  const sendMessage = async (content: string, attachments?: any[]) => {
    try {
      if (isLoggedIn && (attachments?.length || content.trim())) {
        const payload: {
          id: string
          content: string
          attachments?: any[]
          targetMessageId?: string
        } = attachments?.length
          ? {
              id: conversationId,
              content: content.trim(),
              attachments,
            }
          : {
              id: conversationId,
              content: content.trim(),
            }
        if (targetMessageId) payload.targetMessageId = targetMessageId
        socket.current?.emit('sendMessage', payload)
        setTargetMessageId(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        inboxes,
        setInboxes,
        messages,
        chatList,
        fetchMessages,
        remaining,
        sendMessage,
        conversation,
        targetMessageId,
        setTargetMessageId,
        setMessageTemplates,
        messageTemplates,
        toggleShowInbox,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

function useChatContext() {
  const context = useContext(ChatContext)
  if (typeof context === 'undefined')
    throw new Error('useChat must be used within ChatProvider')
  return context
}
export { ChatProvider, useChatContext }
