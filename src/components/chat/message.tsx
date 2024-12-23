import { DotsIcon } from '@/components/icons/accounts/dots-icon'
import { useAccountContext } from '@/contexts/account'
import { useChatContext } from '@/contexts/chat'
import { urlRegex } from '@/lib/regex'
import {
  cn,
  contentUrlFormater,
  generateMediaLink,
  sanitizer,
} from '@/lib/utils'
import chatApiRequest from '@/services/chat.service'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from '@nextui-org/react'
import { format } from 'date-fns'
import { ArrowUpLeft, PinIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  FaFile,
  FaFileAudio,
  FaFileExcel,
  FaFileImage,
  FaFileLines,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
  FaFileZipper,
} from 'react-icons/fa6'

export default function Message({
  data,
  hideInfo,
}: {
  data: any
  hideInfo: boolean
}) {
  const router = useRouter()
  const { conversationId } = useParams()
  const [reaction, setReaction] = useState<string | undefined>(
    data?.emojis?.[0]?.customData
  )
  const { user } = useAccountContext()
  const [targetMessage, setTargetMessage] = useState<any>(null)
  const { setTargetMessageId, messages } = useChatContext()
  const sender = data?.chatMembersOnMessages?.find(
    (member: any) => member.userView == 'SENDER'
  )
  const isMine = sender?.chatMember?.user?.id == user?.id
  const splitedContent = data.content.split(' ')
  const url = splitedContent.find((word: string) => urlRegex.test(word))

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await chatApiRequest.getMessage(data?.targetMessageId)
        if (res.status === 200) setTargetMessage(res.payload)
      } catch (error) {
        console.error(error)
      }
    }
    const msg: any = messages[conversationId as string]?.find(
      (msg) => msg.id == data?.targetMessageId
    )
    if (data?.targetMessageId) {
      if (msg?.id) setTargetMessage(msg)
      else fetchMessage()
    }
  }, [])
  const handleScrollToMessage = async () => {
    let condition = messages[conversationId as string]?.find(
      (msg) => msg.id == data?.targetMessageId
    )

    const msgList = document.querySelector('#message_list')
    if (!msgList) return

    let attempt = 0

    while (!condition?.id && attempt < 10) {
      attempt++
      msgList.scrollTo({
        top: msgList.scrollTop - msgList.scrollHeight,
        behavior: 'smooth',
      })
      condition = messages[conversationId as string]?.find(
        (msg) => msg.id == data?.targetMessageId
      )
      // if (!condition?.id)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    router.replace(`#msg_${data?.targetMessageId}`)
    // document
    //   .querySelector(`#msg_${data?.targetMessageId}`)
    //   ?.classList.add('animate-bounce')
    // setTimeout(() => {
    //   document
    //     .querySelector(`#msg_${data?.targetMessageId}`)
    //     ?.classList.remove('animate-bounce')
    // }, 4000)
  }

  return (
    <div
      key={data.id}
      id={`msg_${data.id}`}
      className={`msg flex items-end gap-4 [&:has([data-state=open])_.actions]:visible [&:hover_.actions]:visible mb-3 ${
        isMine ? 'flex-row-reverse justify-start' : ''
      }`}
    >
      <div>
        {hideInfo ? (
          <div className={cn(isMine ? '' : 'size-10')}></div>
        ) : (
          !isMine && (
            <Avatar
              className="border-none"
              src={generateMediaLink(sender.chatMember.user.avatarFileId)}
            ></Avatar>
          )
        )}
      </div>
      <div className="relative min-w-[250px] max-w-[70%] lg:max-w-[400px]">
        {data?.targetMessageId && (
          <div
            // href={`#msg_${data?.targetMessageId}`}
            onClick={handleScrollToMessage}
            className={`${
              isMine ? 'mr-auto' : 'ml-auto'
            } bg-default-50 w-full line-clamp-1 w-fit translate-y-4 cursor-pointer rounded-2xl px-4 py-2 pb-5`}
          >
            <div
              className="html-content my-2 line-clamp-1 whitespace-pre-line break-words text-xs opacity-75 md:text-sm"
              dangerouslySetInnerHTML={{
                __html: sanitizer(targetMessage?.content),
              }}
            ></div>
          </div>
        )}

        <div
          className={`${
            isMine ? 'bg-default-200' : 'bg-default-100'
          }  relative rounded-2xl p-3`}
        >
          <div
            className={`actions invisible absolute right-2 top-2 z-20 flex items-center gap-2`}
          >
            <div
              onClick={() => {
                setTargetMessageId(data.id)
                ;(document.querySelector('.chat-input') as any)?.focus()
              }}
              className=" cursor-pointer"
            >
              <ArrowUpLeft className="h-4.5 w-4.5" />
            </div>
            <Dropdown>
              <DropdownTrigger>
                <DotsIcon />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <PinIcon />
                    Pin message
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="relative z-10 w-full">
            <div className="flex gap-1.5 pr-10 text-xs font-bold leading-3 text-text-foreground-base">
              {hideInfo
                ? ''
                : `${sender.chatMember.user.firstName} ${sender.chatMember.user.lastName}`}
            </div>

            <div
              className="html-content my-2 whitespace-pre-line break-words text-sm"
              dangerouslySetInnerHTML={{
                __html: sanitizer(contentUrlFormater(data.content) ?? ''),
              }}
            ></div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
              {data.attachments
                ?.filter((attachment: any) =>
                  attachment?.mimetype?.includes('image')
                )
                ?.map((attachment: any, index: number) => (
                  <Link
                    href={generateMediaLink(attachment.path)}
                    target="_blank"
                    key={index}
                  >
                    <Image
                      src={generateMediaLink(attachment.fileId)}
                      width={300}
                      height={300}
                      alt=""
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  </Link>
                ))}
            </div>
            {data.attachments
              ?.filter(
                (attachment: any) => !attachment.mimetype.includes('image')
              )
              ?.map((attachment: any, index: number) => (
                <Link
                  href={generateMediaLink(attachment.fileId)}
                  target="_blank"
                  key={index}
                  className="mt-2 flex items-center gap-2.5"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-background-background-high">
                    {attachment.mimetype.includes('zip') ||
                    attachment.mimetype.includes('rar') ? (
                      <FaFileZipper className="h-5 w-5" />
                    ) : attachment.mimetype.includes('excel') ||
                      attachment.mimetype.includes('sheet') ? (
                      <FaFileExcel className="h-5 w-5" />
                    ) : attachment.mimetype.includes('powerpoint') ||
                      attachment.mimetype.includes('presentation') ? (
                      <FaFilePowerpoint className="h-5 w-5" />
                    ) : attachment.mimetype.includes('msword') ||
                      attachment.mimetype.includes('wordprocessingml') ? (
                      <FaFileWord className="h-5 w-5" />
                    ) : attachment.mimetype.includes('pdf') ? (
                      <FaFilePdf className="h-5 w-5" />
                    ) : attachment.mimetype.includes('audio') ? (
                      <FaFileAudio className="h-5 w-5" />
                    ) : attachment.mimetype.includes('video') ? (
                      <FaFileVideo className="h-5 w-5" />
                    ) : attachment.mimetype.includes('image') ? (
                      <FaFileImage className="h-5 w-5" />
                    ) : attachment.mimetype.includes('text') ? (
                      <FaFileLines className="h-5 w-5" />
                    ) : (
                      <FaFile className="h-5 w-5" />
                    )}
                  </div>
                  <div className="line-clamp-2 w-full truncate text-xs md:text-sm">
                    {attachment.originalName || attachment.filename}
                  </div>
                </Link>
              ))}
            {/* {url && <MetadataPreview url={url} />} */}
          </div>
          <svg
            width="28"
            height="18"
            viewBox="0 0 28 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute bottom-0 ${
              isMine ? '-right-3 -scale-x-100' : '-left-3'
            }`}
          >
            <path
              d="M11 12C10.1798 14.5 2.45118 17.3333 0 18C9.41253 18 19.1758 15.8333 20.6465 14.5L28 16V1L12 0V3V5V5.5C12 6.5 11.8202 9.5 11 12Z"
              className={
                isMine
                  ? 'fill-background-background-mid'
                  : 'fill-background-background-high'
              }
            />
          </svg>
        </div>
      </div>
      <div className="self-center text-xs font-normal text-text-foreground-mid">
        {format(new Date(data.createdAt), 'HH:mm')}
      </div>
    </div>
  )
}

// const MetadataPreview = ({ url }: { url: string }) => {
//   const { data, isLoading } = useSWR(url, (url) => getOG(url), {
//     revalidateOnFocus: false,
//   })
//   const metadata = data?.data?.data?.result
//   if (isLoading) {
//     return (
//       <div>
//         <Skeleton className="mt-2 h-40 w-full sm:min-w-[400px] lg:min-w-[300px] 2xl:w-[350px]" />
//       </div>
//     )
//   }
//   if (metadata === undefined) {
//     return (
//       <div className="p-w mt-2 grid h-40 place-items-center overflow-hidden rounded-lg bg-background-background-base text-center text-sm text-text-foreground-low sm:w-[400px] lg:w-[300px] 2xl:w-[350px]">
//         <div className="w-full">
//           <AlertCircle className="mx-auto h-8 w-8" />
//           <span className="mt-2 line-clamp-3 whitespace-pre-wrap break-words">
//             {`Failed to load ${url}`}
//           </span>
//         </div>
//       </div>
//     )
//   }
//   return (
//     <Link
//       href={url}
//       target="_blank"
//       className="mt-2 flex w-full flex-col gap-2 rounded-lg bg-background-background-base p-2 text-sm sm:w-[400px] lg:w-[300px] 2xl:w-[350px]"
//     >
//       {metadata?.ogImage?.[0]?.url && (
//         <Image
//           src={metadata?.ogImage?.[0]?.url}
//           alt=""
//           className="aspect-[120/63] w-full rounded-lg object-cover"
//           width={300}
//           height={200}
//         />
//       )}
//       {metadata?.ogTitle && (
//         <div className="space-y-1">
//           <div className="line-clamp-2 font-medium">{metadata?.ogTitle}</div>
//           <div className="line-clamp-3 text-text-foreground-low">
//             {metadata?.ogDescription}
//           </div>
//         </div>
//       )}
//     </Link>
//   )
// }
