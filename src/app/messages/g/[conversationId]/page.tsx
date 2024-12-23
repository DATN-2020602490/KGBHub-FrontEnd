'use client'
import ChatInput from '@/components/chat/input'
import Message from '@/components/chat/message'
import { useChatContext } from '@/contexts/chat'
import { cn } from '@/lib/utils'
import { Skeleton } from '@nextui-org/react'
import { InfoIcon, XIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Page() {
  const { messages, fetchMessages, remaining, conversation, targetMessageId } =
    useChatContext()
  const { conversationId }: { conversationId: string } = useParams()
  const [showDetail, setShowDetail] = useState(false)
  const friends: any[] = conversation?.chatMembers.filter(
    (user: any) => user?.user?.id !== user?.id
  )
  const conversationName =
    conversation?.conversationName ||
    friends
      ?.map((friend) => friend.user.lastName || friend.user.firstName)
      .join(', ')
  return (
    <div className="flex h-full w-full flex-col">
      <div className="sticky top-header z-50 flex w-full shrink-0 items-center justify-between border-b border-controls-border-border-base bg-background px-4 pb-2.5 pt-4 lg:top-0 lg:px-5 lg:pt-6">
        {conversation ? (
          <div className="flex items-center text-lg font-semibold leading-5 lg:text-xl lg:leading-7">
            <span className="max-w-[73vw] truncate">{conversationName}</span>
          </div>
        ) : (
          <Skeleton className="h-5 w-24 lg:h-7" />
        )}
        <div className="grid h-5 place-items-center lg:h-7">
          {showDetail ? (
            <XIcon
              className="h-full cursor-pointer"
              onClick={() => setShowDetail(false)}
            />
          ) : (
            <InfoIcon
              className="h-full cursor-pointer"
              onClick={() => setShowDetail(true)}
            />
          )}
        </div>
      </div>
      <div className="relative">
        <div className="relative z-10">
          <div
            id="message_list"
            className={cn(
              'relative z-10 flex h-[calc(100dvh-170px)] flex-col-reverse overflow-auto px-4 lg:px-0',
              targetMessageId
                ? 'h-[calc(100dvh-232px)] lg:h-[calc(100dvh-224px)]'
                : 'h-[calc(100dvh-170px)] lg:h-[calc(100dvh-224px)]'
            )}
          >
            {messages[conversationId] ? (
              <InfiniteScroll
                className="flex flex-col-reverse h-full"
                hasMore={remaining}
                scrollableTarget="message_list"
                inverse={true}
                dataLength={messages[conversationId]?.length}
                next={fetchMessages}
                loader={<></>}
                endMessage={
                  messages[conversationId]?.length > 7 ? (
                    <p className="mt-5 text-center text-xs">
                      <b>Yay! You have seen it all</b>
                    </p>
                  ) : undefined
                }
              >
                <div className="flex flex-col-reverse py-3 lg:px-5">
                  {messages[conversationId]?.map((message, index) => {
                    const prevSender = messages[conversationId][
                      index + 1
                    ]?.chatMembersOnMessages?.find(
                      (member: any) => member.userView == 'SENDER'
                    )
                    const sender = message?.chatMembersOnMessages?.find(
                      (member: any) => member.userView == 'SENDER'
                    )
                    return (
                      <>
                        <Message
                          data={message}
                          key={message.id}
                          hideInfo={
                            sender?.chatMember?.user?.id ==
                            prevSender?.chatMember?.user?.id
                          }
                        />
                      </>
                    )
                  })}
                </div>
              </InfiniteScroll>
            ) : (
              <div className="flex h-full flex-col-reverse items-center gap-2 px-5 py-5">
                <div className="flex w-full flex-row-reverse items-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-20 w-1/3 rounded-2xl" />
                </div>
                <div className="flex w-full items-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-20 w-1/3 rounded-2xl" />
                </div>
                <div className="flex w-full flex-row-reverse items-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-20 w-1/3 rounded-2xl" />
                </div>
              </div>
            )}
          </div>
          <ChatInput taggableList={friends} />
        </div>
        {/* <div
      className={`absolute inset-0 z-20 bg-background ${
        showDetail ? '' : 'hidden'
      }`}
    >
      <GroupDetail />
    </div> */}
      </div>
    </div>
  )
}
