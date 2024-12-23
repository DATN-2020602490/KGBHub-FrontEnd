'use client'
import Link from 'next/link'
import { HiBookmark } from 'react-icons/hi2'
import { PiCheckBold, PiChecksBold, PiSpeakerSlash } from 'react-icons/pi'

import { generateMediaLink, sanitizer } from '@/lib/utils'
import { useAccountContext } from '@/contexts/account'
import { useChatContext } from '@/contexts/chat'
import { CONVERSATION_TYPE } from '@/constants'
import { Avatar, Skeleton } from '@nextui-org/react'
import { CircleFadingPlus } from 'lucide-react'

export default function ChatSidebar() {
  const { chatList } = useChatContext()
  const { user: me } = useAccountContext()
  return (
    <div className="flex h-full w-full shrink-0 flex-col border-controls-border-border-base px-4 lg:w-[300px] lg:border-r lg:p-0">
      <div className="sticky top-[55px] z-10 flex shrink-0 items-center justify-between border-b border-controls-border-border-base bg-background pb-2.5 pt-4 lg:top-0 lg:px-2.5 lg:pt-6">
        <h3 className="text-lg font-semibold lg:text-xl">Chats</h3>
        <Link href="/messages/new-chat">
          <CircleFadingPlus className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex h-full flex-col gap-3 overflow-auto py-2.5 lg:gap-5 lg:px-2.5 lg:py-5">
        {chatList ? (
          chatList.length ? (
            chatList.map((chat, index) => {
              const friends: any[] = chat?.conversation?.chatMembers.filter(
                (user: any) => user?.user.id !== me?.id
              )
              const conversationName =
                chat?.conversation?.conversationType ==
                CONVERSATION_TYPE.CLOUD_SAVE
                  ? 'Saved Messages'
                  : chat?.conversation?.conversationName ||
                    friends
                      .map((friend) =>
                        friends.length == 1
                          ? friend.user.firstName + ' ' + friend.user.lastName
                          : friend.user.lastName || friend.user.firstName
                      )
                      .join(', ')
              const sender = chat?.lastMessage?.chatMembersOnMessages?.find(
                (member: any) => member.userView == 'SENDER'
              )
              const myData = chat?.conversation?.chatMembers?.find(
                (user: any) => user?.user.id == me?.id
              )
              return (
                <Link
                  href={
                    chat?.conversation?.conversationType == CONVERSATION_TYPE.DM
                      ? `/messages/p/${chat?.conversation?.id}`
                      : chat?.conversation?.conversationType ==
                        CONVERSATION_TYPE.CLOUD_SAVE
                      ? '/messages/saved'
                      : `/messages/g/${chat?.conversation?.id}`
                  }
                  className="flex w-full gap-2"
                  key={index}
                >
                  {chat.conversation.conversationType ===
                  CONVERSATION_TYPE.CLOUD_SAVE ? (
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-base-brand-blue text-white lg:h-11 lg:w-11">
                      <HiBookmark className="h-5 w-5" />
                    </div>
                  ) : chat.conversation.conversationType ===
                    CONVERSATION_TYPE.DM ? (
                    <Avatar
                      className="h-9 w-9 lg:h-11 lg:w-11"
                      src={generateMediaLink(friends[0]?.user?.avatarFileId)}
                    ></Avatar>
                  ) : chat.conversation.conversationType ===
                    CONVERSATION_TYPE.COURSE_GROUP_CHAT ? (
                    <Avatar
                      className="h-9 w-9 lg:h-11 lg:w-11"
                      src={generateMediaLink(chat?.conversation?.avatarFileId)}
                    ></Avatar>
                  ) : (
                    <div className="h-9 w-9 lg:h-11 lg:w-11">
                      <Avatar
                        className="h-5 w-5 lg:h-7 lg:w-7"
                        src={generateMediaLink(friends[0]?.user?.avatar)}
                      ></Avatar>
                      <Avatar
                        className="h-5 w-5 -translate-y-1/3 translate-x-1/2 lg:h-7 lg:w-7"
                        src={generateMediaLink(friends[1]?.user?.avatar)}
                      ></Avatar>
                    </div>
                  )}
                  <div className="flex w-[calc(100%-52px)] flex-1 flex-col border-b border-controls-border-border-base pb-2.5 lg:gap-2">
                    <div className="flex gap-2">
                      <div className="w-[80%] truncate text-xs font-semibold leading-5 lg:text-sm lg:font-medium">
                        {conversationName}
                      </div>
                      {/* <div className="whitespace-nowrap text-xs text-text-foreground-low lg:text-xs">
                        {format(
                          new Date(chat?.lastMessage?.updatedAt),
                          'HH:mm MM/dd/yy'
                        )}
                      </div> */}
                    </div>
                    {chat?.lastMessage ? (
                      <div className="flex items-center justify-between gap-4">
                        <div
                          className="html-content truncate text-xs leading-4 text-text-foreground-low"
                          dangerouslySetInnerHTML={{
                            __html: sanitizer(
                              sender?.chatMember?.user?.id === me?.id
                                ? `You: ${chat?.lastMessage?.content || ''}`
                                : `${
                                    sender?.chatMember?.user?.firstName || ''
                                  }: ${chat?.lastMessage?.content || ''}`
                            ),
                          }}
                        ></div>
                        {chat?.conversation?.conversationType !=
                        CONVERSATION_TYPE.CLOUD_SAVE ? (
                          !myData.isMute ? (
                            sender?.userId == me?.id ? (
                              chat?.lastMessage?.seenByAll ? (
                                <div className="grid place-items-center rounded-lg bg-background-background-high px-1.5 py-0.5 text-text-foreground-mid ">
                                  <PiChecksBold className="h-3 w-3" />
                                </div>
                              ) : (
                                <div className="grid place-items-center rounded-lg bg-background-background-high px-1.5 py-0.5 text-text-foreground-mid ">
                                  <PiCheckBold className="h-3 w-3" />
                                </div>
                              )
                            ) : (
                              !!chat?.conversation?.unreadMessages && (
                                <div className="rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-semibold leading-[13px]">
                                  {chat?.conversation?.unreadMessages}
                                </div>
                              )
                            )
                          ) : (
                            <div className="grid place-items-center rounded-lg bg-background-background-high px-1.5 py-0.5 text-text-foreground-mid ">
                              <PiSpeakerSlash className="h-3 w-3" />
                            </div>
                          )
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="truncate text-xs italic leading-4 text-text-foreground-low">
                          No messages yet
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })
          ) : (
            <>
              <div className="w-full text-center">You have no messages yet</div>
            </>
          )
        ) : (
          [...Array(10)].fill(null).map((e, i) => (
            <div className="flex gap-2" key={i}>
              <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2 border-b border-controls-border-border-base pb-2.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
