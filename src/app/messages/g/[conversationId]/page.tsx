'use client'
import ConversationBox from '@/components/chat/converstation-popup'
import { ChatContext } from '@/contexts/chat'
import { useContext } from 'react'

export default function Page() {
  const { sendMessage } = useContext(ChatContext)
  const handler = async () => {
    try {
      await sendMessage('ahihi')
    } catch (error) {
      console.log(error)
    }
  }
  return <ConversationBox />
}
