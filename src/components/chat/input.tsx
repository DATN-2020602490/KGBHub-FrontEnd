import { useChatContext } from '@/contexts/chat'
import {
  displayFullname,
  formatBytes,
  generateMediaLink,
  sanitizer,
} from '@/lib/utils'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Spinner,
} from '@nextui-org/react'
import { PlusIcon, SendIcon, XIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import ContentEditable from 'react-contenteditable'
import chatApiRequest from '@/services/chat.service'
import {
  FaFile,
  FaFileAudio,
  FaFileExcel,
  FaFileLines,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
  FaFileZipper,
  FaUpload,
  FaXmark,
} from 'react-icons/fa6'
import { v4 } from 'uuid'

export default function ChatInput({ taggableList }: { taggableList?: any[] }) {
  const {
    sendMessage,
    conversation,
    targetMessageId,
    setTargetMessageId,
    messages,
    setMessageTemplates,
  } = useChatContext()
  const sendMessageRef = useRef(sendMessage)
  const fileInputRef = useRef<any>()
  useEffect(() => {
    sendMessageRef.current = sendMessage
  }, [sendMessage])

  const conversationRef = useRef(conversation)
  useEffect(() => {
    conversationRef.current = conversation
  }, [conversation])
  const [lastWord, setLastWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const messageRef = useRef('')
  const ref = useRef<any>()
  const [selectedFiles, setSelectedFiles] = useState<any[]>([])
  const selectedFilesRef = useRef<any[]>([])
  const targetMessage = messages[conversation?.id]?.find(
    (msg) => msg.id == targetMessageId
  )

  const sanitize = () => {
    const text = sanitizer(messageRef.current)
    messageRef.current = text
    setMessage(text)
    return text
  }

  const tag = (username: string) => {
    const withoutLastWord = messageRef.current.slice(0, -lastWord.length)
    const tagElement = ` <a href="/@${username}" target="_blank" class="tag">@${username}</a>&nbsp;`
    messageRef.current = withoutLastWord + tagElement
    setMessage(withoutLastWord + tagElement)
    setLastWord('')
    ref.current.focus()
  }

  const onContentChange = (content: string) => {
    setMessageTemplates([])
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const anchorTags = doc.querySelectorAll('a.tag')
    const lastAnchorTag = anchorTags[anchorTags.length - 1]
    if (
      lastAnchorTag &&
      lastAnchorTag.getAttribute('href') != `/${lastAnchorTag.innerHTML}`
    ) {
      lastAnchorTag.remove()
    }
    const newContent = doc.body.innerHTML
    setMessage(newContent)
    messageRef.current = newContent
    setLastWord(
      newContent
        .split(' ')
        .at(-1)
        ?.split('<br>')
        .at(-1)
        ?.split('&nbsp;')
        .at(-1) || ''
    )
  }

  const handleChangeFile = (fileList: any) => {
    const files = Array.from(fileList) as any[]
    setMessageTemplates([])
    console.log(files)
    if (files.some((file) => file.size > 1024 * 1024 * 1024)) {
      toast.warning('There are some files that are over 1GB. Please try again.')
      return
    }
    if (selectedFilesRef.current.length >= 1024 * 1024 * 1024) {
      toast.warn('Please remove or send other attachments in another message')
      return
    }
    selectedFilesRef.current = [
      ...files,
      ...(selectedFilesRef.current?.filter((file) =>
        files.every((f) => f.name != file.name)
      ) || []),
    ].slice(0, 10)
    setSelectedFiles(selectedFilesRef.current)
  }

  const removeFile = (file: any) => {
    selectedFilesRef.current = [
      ...selectedFilesRef.current.filter((f) => file.name != f.name),
    ]
    setSelectedFiles(selectedFilesRef.current)
    if (selectedFilesRef.current.length == 0) fileInputRef.current.value = ''
  }

  const sendMessageHandler = async () => {
    try {
      if (loading) return
      setLoading(true)
      let attachments
      if (selectedFilesRef.current.length) {
        const formData = new FormData()
        for (let i = 0; i < selectedFilesRef.current.length; i++) {
          formData.append(
            'attachments',
            selectedFilesRef.current[i],
            selectedFilesRef.current[i].name
          )
        }
        formData.append('conversationId', conversationRef.current?.id)
        try {
          const res = await chatApiRequest.uploadAttachment(formData)
          if (res?.status != 200) {
            toast.warn(
              'Some attachments failed to upload. Please try again or contact us for assistance.'
            )
            return
          }
          attachments = (res?.payload as any[])?.map((result: any) => result.id)
        } catch (error) {
          toast.warn(
            'Some attachments failed to upload. Please try again or contact us for assistance.'
          )
          return
        }
      }
      const message = sanitize()
      sendMessageRef.current(message, attachments)
      setMessage('')
      setSelectedFiles([])
      messageRef.current = ''
      selectedFilesRef.current = []
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
      toast.warn('Message sending failed. Please try again or contact us.')
    }
  }

  return (
    <>
      <div className="sticky bottom-0 z-10 px-4 py-3 lg:p-4">
        {targetMessageId && (
          <div className="mb-2 flex items-center justify-between rounded-full bg-default-200 px-4 py-2 text-xs md:text-sm">
            <div>
              <span className="">
                Replying to{' '}
                {(() => {
                  const sender = targetMessage?.chatMembersOnMessages.find(
                    (member: any) => member.userView == 'SENDER'
                  )
                  return (
                    <b>
                      {displayFullname(
                        sender?.chatMember?.user?.firstName,
                        sender?.chatMember?.user?.lastName
                      )}
                    </b>
                  )
                })()}
              </span>
            </div>
            <span
              className="cursor-pointer rounded-full p-2 hover:bg-text-foreground-white"
              onClick={() => setTargetMessageId(null)}
            >
              <XIcon />
            </span>
          </div>
        )}

        <div className="relative flex items-center gap-3 rounded-3xl bg-default-100 p-2 lg:rounded-[32px] lg:p-4">
          <div className="self-start">
            <Dropdown>
              <DropdownTrigger>
                <div className="grid h-5 w-5 place-items-center rounded-full bg-default-200 text-sm font-semibold md:h-8 md:w-8 cursor-pointer">
                  <PlusIcon className="h-3 w-3 md:h-4 md:w-4" />
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>
                  <label
                    htmlFor="chat-upload-file"
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <FaUpload />
                    Upload File
                  </label>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          {useMemo(
            () => (
              <>
                {!!selectedFiles.length && (
                  <div
                    className={`absolute ${
                      targetMessageId
                        ? 'bottom-[calc(100%+76px)]'
                        : 'bottom-[calc(100%+16px)]'
                    } z-20 w-[calc(100%-12px)] px-4 lg:-mx-5 lg:w-full`}
                  >
                    <div className=" grid w-full grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
                      {selectedFiles.map((file, index) => {
                        if (file.type.includes('image')) {
                          return (
                            <div
                              key={index}
                              className="relative flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-lg bg-default-200 [&:hover_.remove]:block"
                            >
                              <Image
                                src={URL.createObjectURL(file)}
                                width={300}
                                height={300}
                                alt=""
                                className="aspect-square w-full rounded-lg object-cover"
                              />
                              <div
                                className="remove absolute right-2 top-2 cursor-pointer text-destructive "
                                onClick={() => removeFile(file)}
                              >
                                <FaXmark />
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <div
                              key={index}
                              className="relative flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-lg bg-default-200 p-3 [&:hover_.remove]:block"
                            >
                              <div className="text-xs text-text-foreground-low">
                                {formatBytes(file.size)}
                              </div>
                              {file.type.includes('zip') ||
                              file.type.includes('rar') ? (
                                <FaFileZipper className="h-6 w-6 md:h-8 md:w-8" />
                              ) : file.type.includes('excel') ||
                                file.type.includes('sheet') ? (
                                <FaFileExcel className="h-6 w-6 md:h-8 md:w-8" />
                              ) : file.type.includes('powerpoint') ||
                                file.type.includes('presentation') ? (
                                <FaFilePowerpoint className="h-6 w-6 md:h-8 md:w-8" />
                              ) : file.type.includes('msword') ||
                                file.type.includes('wordprocessingml') ? (
                                <FaFileWord className="h-6 w-6 md:h-8 md:w-8" />
                              ) : file.type.includes('pdf') ? (
                                <FaFilePdf className="h-6 w-6 md:h-8 md:w-8" />
                              ) : file.type.includes('audio') ? (
                                <FaFileAudio className="h-6 w-6 md:h-8 md:w-8" />
                              ) : file.type.includes('video') ? (
                                <FaFileVideo className="h-6 w-6 md:h-8 md:w-8" />
                              ) : file.type.includes('text') ? (
                                <FaFileLines className="h-6 w-6 md:h-8 md:w-8" />
                              ) : (
                                <FaFile className="h-6 w-6 md:h-8 md:w-8" />
                              )}

                              <div className="line-clamp-1 grid w-full place-items-center truncate text-center text-xs font-medium md:text-xs">
                                {file.name}
                              </div>
                              <div
                                className="remove absolute right-2 top-2 cursor-pointer text-destructive "
                                onClick={() => removeFile(file)}
                              >
                                <FaXmark />
                              </div>
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                )}
              </>
            ),
            [selectedFiles.length, targetMessageId]
          )}
          {(lastWord.at(0) == '@' || lastWord.includes('>@')) && (
            <div
              className={`absolute ${
                targetMessageId
                  ? 'bottom-[calc(100%+76px)]'
                  : 'bottom-[calc(100%+16px)]'
              } z-20 w-[calc(100%-12px)] space-y-3 rounded-lg bg-default-200 px-4 lg:-mx-5 lg:w-full`}
            >
              {taggableList
                ?.filter(
                  (user) =>
                    user?.user?.username.includes(
                      lastWord.at(0) == '@'
                        ? lastWord.slice(1)
                        : lastWord
                            .replace('class="tag">@', '')
                            .replace('</a>', '')
                    ) ||
                    user?.user?.firstName.includes(
                      lastWord.at(0) == '@'
                        ? lastWord.slice(1)
                        : lastWord
                            .replace('class="tag">@', '')
                            .replace('</a>', '')
                    ) ||
                    user?.user?.lastName.includes(
                      lastWord.at(0) == '@'
                        ? lastWord.slice(1)
                        : lastWord
                            .replace('class="tag">@', '')
                            .replace('</a>', '')
                    )
                )
                ?.map((user) => (
                  <div
                    onClick={() => tag(user?.user?.username)}
                    className="flex cursor-pointer items-center gap-2 py-0.5 first:pt-3 last:pb-3"
                    key={user?.id || user?.userId || user?.user?.id || v4()}
                  >
                    <Avatar
                      src={generateMediaLink(user?.user?.avatar)}
                      className="h-6 w-6"
                    ></Avatar>
                    <div className="text-xs md:text-sm">
                      <div className="font-medium">{`${user?.user?.firstName} ${user?.user?.lastName}`}</div>
                      <div className="text-text-foreground-low">{`@${user?.user?.username}`}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          <ContentEditable
            className="editable chat-input max-h-40 min-h-[20px] w-full cursor-text overflow-auto rounded-none border-none p-0 px-2 text-sm outline-none empty:before:text-text-foreground-low/80 empty:before:content-[attr(aria-placeholder)] 
        lg:px-0 [&_.tag]:font-medium [&_.tag]:text-base-brand-blue"
            tagName="div"
            aria-placeholder="Type your message here..."
            innerRef={ref}
            html={
              (message || messageRef.current).replace('<br>', '') == ''
                ? ''
                : message || messageRef.current
            }
            onChange={(evt) => onContentChange(evt.target.value)}
            onBlur={sanitize}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!e.shiftKey) {
                  e.preventDefault()
                  sendMessageHandler()
                }
              }
            }}
          />

          {loading ? (
            <Spinner className="shrink-0 self-start" />
          ) : (
            <div
              onClick={sendMessageHandler}
              className={`h-6 w-6 cursor-pointer rounded-full md:h-8 md:w-8 ${
                message || selectedFiles.length
                  ? 'bg-controls-accent-accent'
                  : ''
              } grid shrink-0 place-items-center self-start`}
            >
              <SendIcon className="h-4 w-4 shrink-0 md:h-5 md:w-5 " />
            </div>
          )}
        </div>
      </div>
      <input
        className="hidden"
        id="chat-upload-file"
        type="file"
        multiple
        ref={fileInputRef}
        accept="text/*,audio/*,video/*,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
        application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,
        application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.rar,application/pdf"
        onChange={(e) => handleChangeFile(e.target.files)}
      />
    </>
  )
}
