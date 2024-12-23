'use client'

import ChatInput from '@/components/chat/input'
import Message from '@/components/chat/message'
import { CONVERSATION_TYPE } from '@/constants'
import { useChatContext } from '@/contexts/chat'
import { Skeleton } from '@nextui-org/react'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Page() {
  const { messages, fetchMessages, remaining, conversation, chatList } =
    useChatContext()
  const conversationId = chatList?.find(
    (chat) => chat.conversation.conversationType == CONVERSATION_TYPE.CLOUD_SAVE
  )?.conversation?.id
  const conversationName = 'Saved Messages'
  console.log(conversation)
  if (!conversationId) return null
  return (
    <div className="flex h-full w-full flex-col">
      <div className="sticky top-header lg:top-0 bg-background px-4 z-50 pt-4 flex w-full shrink-0 items-center justify-between border-b border-controls-border-border-base pb-2.5 lg:px-5 lg:pt-6">
        {conversation ? (
          <div className="flex items-center text-lg font-semibold leading-5 lg:text-xl lg:leading-7">
            <span className="max-w-[73vw] truncate">{conversationName}</span>
          </div>
        ) : (
          <Skeleton className="h-5 w-24 lg:h-7" />
        )}
        <div className="h-5 lg:h-7"></div>
      </div>
      <div
        id="message_list"
        className="flex h-[calc(100dvh-170px)] lg:h-[calc(100dvh-224px)] px-4 lg:px-0 flex-col-reverse overflow-auto relative"
      >
        {messages[conversationId] ? (
          <InfiniteScroll
            className="flex flex-col-reverse"
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
              {messages[conversationId]?.map((message) => {
                return (
                  <Message data={message} key={message.id} hideInfo={false} />
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
      <ChatInput />
    </div>
  )
}
