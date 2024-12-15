'use client'
import Empty from '@/components/common/empty'
import ChatIcon from '@/components/icons/chat-icon'
import { USER_VIEW } from '@/constants'
import { useAccountContext } from '@/contexts/account'
import { useChatContext } from '@/contexts/chat'
import { generateMediaLink } from '@/lib/utils'
import { useListConversations } from '@/queries/useChat'
import {
  Badge,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

export default function ListChatsPopover() {
  const { user } = useAccountContext()
  const { setInboxes } = useChatContext()
  const { data, isLoading } = useListConversations()

  const unreadMessageCount =
    data?.payload?.reduce(
      (total, current) => (total += current?.conversation?.unreadMessages || 0),
      0
    ) || 0

  return (
    <Popover placement="bottom" showArrow shouldBlockScroll>
      {unreadMessageCount > 0 ? (
        <Badge
          color="danger"
          content={unreadMessageCount}
          shape="circle"
          size="sm"
        >
          <PopoverTrigger>
            <span className="cursor-pointer">
              <ChatIcon className="size-6" />
            </span>
          </PopoverTrigger>
        </Badge>
      ) : (
        <PopoverTrigger>
          <span className="cursor-pointer">
            <ChatIcon className="size-6" />
          </span>
        </PopoverTrigger>
      )}
      <PopoverContent className="p-4 w-[480px]">
        <h3 className="text-lg font-semibold mb-2">Chats</h3>
        {!isLoading ? (
          <div className="space-y-2.5">
            {data?.payload.map((chat) => {
              const sender = chat?.lastMessage?.chatMembersOnMessages?.find(
                (member) => member.userView === USER_VIEW.SENDER
              )?.chatMember?.user
              return (
                <div
                  key={chat.conversation.id}
                  className="flex gap-x-4 p-4 hover:bg-default-100 rounded-md cursor-pointer"
                >
                  <Image
                    src={generateMediaLink(chat.conversation.avatarFileId)}
                    fallbackSrc="/images/cup.png"
                    alt={chat.conversation.conversationName}
                    className="[div:has(>&)]:size-10 rounded-full object-cover aspect-square"
                  />
                  <div>
                    <p className="font-semibold line-clamp-1">
                      {chat.conversation.conversationName}
                    </p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: chat?.lastMessage?.content
                          ? `${
                              sender.id === user?.id ? 'You' : sender.firstName
                            }: ${chat?.lastMessage?.content}`
                          : '👋 Say hello and start the conversation!',
                      }}
                      className="text-default-500 text-sm"
                    ></p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty />
        )}
      </PopoverContent>
    </Popover>
  )
}
